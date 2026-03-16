export interface Document {
  id: string;
  text: string;
  embedding?: number[];
  metadata?: Record<string, any>;
}

export interface QueryResult {
  document: Document;
  relevance: number;
  context: string;
}

export interface RAGResponse {
  query: string;
  retrievedDocs: QueryResult[];
  response: string;
  confidence: number;
}

// Simple embedding generation (cosine similarity simulation)
export function generateEmbedding(text: string): number[] {
  const tokens = text.toLowerCase().split(/\s+/);
  const embedding = new Array(128).fill(0);
  
  tokens.forEach((token) => {
    for (let i = 0; i < token.length; i++) {
      const charCode = token.charCodeAt(i);
      embedding[charCode % 128] += (i + 1) / token.length;
    }
  });
  
  // Normalize
  const norm = Math.sqrt(embedding.reduce((a, b) => a + b * b, 0));
  return embedding.map(v => norm > 0 ? v / norm : 0);
}

export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2) + 1e-8);
}

// Naive RAG: Simple keyword matching + retrieval
export function naiveRAG(query: string, documents: Document[], k: number = 3): QueryResult[] {
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  const scored = documents.map(doc => {
    let score = 0;
    const docTerms = doc.text.toLowerCase().split(/\s+/);
    
    queryTerms.forEach(qTerm => {
      docTerms.forEach(dTerm => {
        if (dTerm.includes(qTerm) || qTerm.includes(dTerm)) {
          score += 1;
        }
      });
    });
    
    const relevance = score / Math.max(queryTerms.length, docTerms.length);
    const context = docTerms.slice(0, 15).join(' ') + '...';
    
    return { document: doc, relevance, context };
  });
  
  return scored
    .filter(r => r.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, k);
}

// Vector-based RAG: Using embeddings for retrieval
export function vectorRAG(query: string, documents: Document[], k: number = 3): QueryResult[] {
  const queryEmbedding = generateEmbedding(query);
  
  const scored = documents.map(doc => {
    const docEmbedding = doc.embedding || generateEmbedding(doc.text);
    const relevance = cosineSimilarity(queryEmbedding, docEmbedding);
    const context = doc.text.substring(0, 200) + '...';
    
    return { document: doc, relevance, context };
  });
  
  return scored
    .filter(r => r.relevance > 0.1)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, k);
}

// Rerank retrieved documents by relevance score
export function rerankDocuments(query: string, documents: QueryResult[], k: number = 3): QueryResult[] {
  const queryTerms = new Set(query.toLowerCase().split(/\s+/));
  
  const reranked = documents.map(result => {
    const docTerms = result.document.text.toLowerCase().split(/\s+/);
    let termFreq = 0;
    
    queryTerms.forEach(qTerm => {
      docTerms.forEach((dTerm, idx) => {
        if (dTerm.includes(qTerm)) {
          // Position-based boost (earlier terms are more important)
          termFreq += 1 / (1 + idx * 0.1);
        }
      });
    });
    
    return {
      ...result,
      relevance: result.relevance * (1 + termFreq * 0.2)
    };
  });
  
  return reranked.sort((a, b) => b.relevance - a.relevance).slice(0, k);
}

// Multimodal RAG simulation (handles text + metadata)
export function multimodalRAG(query: string, documents: Document[], k: number = 3): QueryResult[] {
  const scored = documents.map(doc => {
    // Text similarity
    const textSim = vectorRAG(query, [doc], 1)[0]?.relevance || 0;
    
    // Metadata matching
    let metaSim = 0;
    if (doc.metadata) {
      const queryMeta = query.toLowerCase();
      Object.values(doc.metadata).forEach(val => {
        if (typeof val === 'string' && queryMeta.includes(val.toLowerCase())) {
          metaSim += 0.3;
        }
      });
    }
    
    const relevance = textSim * 0.7 + metaSim * 0.3;
    const context = doc.text.substring(0, 200) + '...';
    
    return { document: doc, relevance, context };
  });
  
  return scored
    .filter(r => r.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, k);
}

// Generate response from retrieved documents
export function generateRAGResponse(query: string, retrievedDocs: QueryResult[]): string {
  if (retrievedDocs.length === 0) {
    return `No relevant information found for: "${query}"`;
  }
  
  const topDoc = retrievedDocs[0];
  const avgRelevance = retrievedDocs.reduce((a, d) => a + d.relevance, 0) / retrievedDocs.length;
  
  let response = `Based on ${retrievedDocs.length} relevant document(s):\n\n`;
  response += topDoc.context;
  
  if (retrievedDocs.length > 1) {
    response += `\n\nAlso relevant: ${retrievedDocs.slice(1, 3).map(d => d.document.id).join(', ')}`;
  }
  
  return response;
}

// Sample documents for demonstration
export const sampleDocuments: Document[] = [
  {
    id: 'neural-001',
    text: 'Neural networks are computational models inspired by biological neurons. They consist of interconnected layers of nodes that learn patterns through backpropagation. The forward pass computes activations through layers, while the backward pass computes gradients for optimization. Common architectures include feedforward networks, CNNs for images, and RNNs for sequences.',
    metadata: { topic: 'neural-networks', type: 'architecture' }
  },
  {
    id: 'transformer-001',
    text: 'Transformers are deep learning models using self-attention mechanisms. They process sequences in parallel without recurrence, making them efficient for large datasets. Multi-head attention allows the model to focus on different representation subspaces. Positional encoding preserves sequence order information. Transformers power modern language models like GPT and BERT.',
    metadata: { topic: 'transformers', type: 'architecture' }
  },
  {
    id: 'ml-001',
    text: 'Machine learning algorithms learn patterns from data without explicit programming. Supervised learning includes regression and classification tasks. Unsupervised learning finds hidden patterns in unlabeled data through clustering and dimensionality reduction. Reinforcement learning trains agents through reward signals. Key algorithms include decision trees, random forests, SVM, and neural networks.',
    metadata: { topic: 'machine-learning', type: 'overview' }
  },
  {
    id: 'gradient-001',
    text: 'Gradient descent is an optimization algorithm that minimizes loss by iteratively moving in the direction of steepest descent. The learning rate controls step size. Variants include batch gradient descent, stochastic gradient descent (SGD), and Adam optimizer. Momentum accelerates convergence and helps escape local minima. Proper learning rate selection is critical for convergence.',
    metadata: { topic: 'optimization', type: 'algorithm' }
  },
  {
    id: 'embedding-001',
    text: 'Embeddings represent data as dense vectors in high-dimensional space. Word embeddings like Word2Vec and GloVe capture semantic relationships between words. Document embeddings extend this to longer texts. Embeddings enable similarity search and clustering. They form the foundation of modern RAG systems for semantic retrieval.',
    metadata: { topic: 'embeddings', type: 'technique' }
  },
  {
    id: 'rag-001',
    text: 'Retrieval-Augmented Generation combines retrieval with generative models. A retriever finds relevant documents from a knowledge base based on a query. The generator uses retrieved context to produce accurate responses. RAG improves factuality and reduces hallucination. Vector databases and semantic search enable efficient retrieval.',
    metadata: { topic: 'rag', type: 'system' }
  },
  {
    id: 'attention-001',
    text: 'Attention mechanisms allow models to focus on relevant parts of input. Self-attention compares each token with all other tokens. Multi-head attention processes multiple representation subspaces in parallel. Attention weights are computed using query, key, and value matrices. This mechanism is fundamental to transformers.',
    metadata: { topic: 'transformers', type: 'mechanism' }
  },
  {
    id: 'clustering-001',
    text: 'Clustering groups similar data points together without labels. K-means partitions data into K clusters by iteratively assigning points to nearest centroids. Hierarchical clustering builds dendrograms showing relationships. DBSCAN finds density-connected clusters. Clustering is used for customer segmentation, anomaly detection, and data exploration.',
    metadata: { topic: 'unsupervised-learning', type: 'algorithm' }
  }
];
