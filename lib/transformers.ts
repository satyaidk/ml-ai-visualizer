// Transformer Architecture visualization and utilities

export interface Token {
  id: string;
  value: string;
  embedding: number[];
  position: number;
}

export interface AttentionHead {
  id: string;
  scores: number[][];
  query: number[];
  key: number[];
  value: number[];
  output: number[];
}

export interface MultiHeadAttention {
  heads: AttentionHead[];
  output: number[];
}

export interface TransformerState {
  tokens: Token[];
  embedding: number[][];
  positionalEncoding: number[][];
  attentionHeads: AttentionHead[];
  attentionScores: number[][];
}

// Create embeddings for tokens
export function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/).filter((t) => t.length > 0);
}

export function createEmbedding(token: string, dimension: number = 8): number[] {
  // Simple hash-based embedding for consistency
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = ((hash << 5) - hash) + token.charCodeAt(i);
    hash = hash & hash;
  }

  const embedding: number[] = [];
  for (let i = 0; i < dimension; i++) {
    const subHash = Math.abs(hash + i * 73) % 100;
    embedding.push((Math.sin(subHash) + 1) / 2); // Normalize to [0, 1]
  }
  return embedding;
}

export function createPositionalEncoding(
  sequenceLength: number,
  dimension: number
): number[][] {
  const encoding: number[][] = [];

  for (let pos = 0; pos < sequenceLength; pos++) {
    const posEncoding: number[] = [];
    for (let i = 0; i < dimension; i++) {
      const angle = pos / Math.pow(10000, (2 * i) / dimension);
      if (i % 2 === 0) {
        posEncoding.push(Math.sin(angle));
      } else {
        posEncoding.push(Math.cos(angle));
      }
    }
    encoding.push(posEncoding);
  }

  return encoding;
}

export function addEmbeddings(emb1: number[], emb2: number[]): number[] {
  return emb1.map((val, i) => (val + emb2[i]) / 2);
}

// Attention mechanism
export function scaledDotProductAttention(
  query: number[],
  keys: number[][],
  values: number[][],
  scale: number = 1
): number[] {
  // Calculate attention scores
  const scores = keys.map((key) => {
    let dotProduct = 0;
    for (let i = 0; i < query.length; i++) {
      dotProduct += query[i] * key[i];
    }
    return dotProduct / Math.sqrt(scale);
  });

  // Softmax
  const maxScore = Math.max(...scores);
  const expScores = scores.map((s) => Math.exp(s - maxScore));
  const sumExpScores = expScores.reduce((a, b) => a + b, 0);
  const weights = expScores.map((s) => s / sumExpScores);

  // Weighted sum of values
  const output = new Array(values[0].length).fill(0);
  weights.forEach((weight, i) => {
    for (let j = 0; j < values[i].length; j++) {
      output[j] += weight * values[i][j];
    }
  });

  return output;
}

export function multiHeadAttention(
  query: number[],
  keys: number[][],
  values: number[][],
  numHeads: number = 4
): { heads: AttentionHead[]; output: number[] } {
  const headDim = query.length / numHeads;
  const heads: AttentionHead[] = [];

  for (let h = 0; h < numHeads; h++) {
    const start = h * headDim;
    const end = start + headDim;

    const headQuery = query.slice(start, end);
    const headKeys = keys.map((k) => k.slice(start, end));
    const headValues = values.map((v) => v.slice(start, end));

    const headOutput = scaledDotProductAttention(headQuery, headKeys, headValues, headDim);

    const scores = headKeys.map((key) => {
      let dotProduct = 0;
      for (let i = 0; i < headQuery.length; i++) {
        dotProduct += headQuery[i] * key[i];
      }
      return dotProduct / Math.sqrt(headDim);
    });

    heads.push({
      id: `head-${h}`,
      scores: scores.map((s) => [s]),
      query: headQuery,
      key: headKeys[0] || [],
      value: headValues[0] || [],
      output: headOutput,
    });
  }

  // Concatenate outputs
  const output: number[] = [];
  heads.forEach((head) => {
    output.push(...head.output);
  });

  return { heads, output };
}

export function feedForwardNetwork(input: number[], hiddenDim: number = 32): number[] {
  // First linear layer with ReLU
  const hidden: number[] = [];
  for (let i = 0; i < hiddenDim; i++) {
    let sum = 0;
    for (let j = 0; j < input.length; j++) {
      sum += input[j] * (Math.sin(i + j) * 0.5 + 0.5); // Pseudo-weight
    }
    hidden.push(Math.max(0, sum / input.length)); // ReLU
  }

  // Second linear layer
  const output: number[] = [];
  for (let i = 0; i < input.length; i++) {
    let sum = 0;
    for (let j = 0; j < hiddenDim; j++) {
      sum += hidden[j] * (Math.cos(i + j) * 0.5 + 0.5); // Pseudo-weight
    }
    output.push(sum / hiddenDim);
  }

  return output;
}

export function layerNorm(input: number[]): number[] {
  const mean = input.reduce((a, b) => a + b) / input.length;
  const variance =
    input.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / input.length;
  const stdDev = Math.sqrt(variance + 1e-6);

  return input.map((x) => (x - mean) / stdDev);
}

export function transformerBlock(
  input: number[],
  keys: number[][],
  values: number[][],
  numHeads: number = 4
): number[] {
  // Multi-head attention
  const { output: attentionOutput } = multiHeadAttention(input, keys, values, numHeads);

  // Add & Norm
  const residual1 = input.map((x, i) => x + attentionOutput[i]);
  const norm1 = layerNorm(residual1);

  // Feed-forward network
  const ffnOutput = feedForwardNetwork(norm1);

  // Add & Norm
  const residual2 = norm1.map((x, i) => x + ffnOutput[i]);
  const norm2 = layerNorm(residual2);

  return norm2;
}

export function initializeTransformerState(
  text: string,
  embeddingDim: number = 8
): TransformerState {
  const words = tokenize(text);
  const tokens: Token[] = words.map((word, idx) => ({
    id: `token-${idx}`,
    value: word,
    embedding: createEmbedding(word, embeddingDim),
    position: idx,
  }));

  const embedding = tokens.map((t) => t.embedding);
  const positionalEncoding = createPositionalEncoding(words.length, embeddingDim);

  // Combine embeddings with positional encoding
  const combined = embedding.map((emb, i) => addEmbeddings(emb, positionalEncoding[i]));

  // Initialize attention with self-attention (all tokens attend to all tokens)
  const { heads } = multiHeadAttention(combined[0], combined, combined, 4);

  const attentionScores: number[][] = [];
  words.forEach((_, i) => {
    const scores = words.map((_, j) => {
      const dotProduct = combined[i].reduce((sum, x, k) => sum + x * combined[j][k], 0);
      return Math.tanh(dotProduct); // Normalize to [-1, 1] for visualization
    });
    attentionScores.push(scores);
  });

  return {
    tokens,
    embedding: combined,
    positionalEncoding,
    attentionHeads: heads,
    attentionScores,
  };
}
