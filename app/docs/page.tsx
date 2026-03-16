'use client';

import { Navigation } from '@/components/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const sections = [
    {
      id: 'neural-networks',
      title: 'Neural Networks',
      description: 'Deep dive into how artificial neural networks learn',
      topics: [
        { name: 'Neurons & Layers', description: 'Basic building blocks of neural networks' },
        { name: 'Forward Propagation', description: 'How data flows through the network' },
        { name: 'Backpropagation', description: 'How networks learn from errors' },
        { name: 'Activation Functions', description: 'Sigmoid, ReLU, Tanh and their properties' },
        { name: 'Weight Updates', description: 'Gradient descent and parameter optimization' },
      ],
    },
    {
      id: 'ml-algorithms',
      title: 'Machine Learning Algorithms',
      description: 'Fundamental algorithms that power modern ML',
      topics: [
        { name: 'Gradient Descent', description: 'The optimization algorithm behind most ML' },
        { name: 'K-Means Clustering', description: 'Unsupervised learning through clustering' },
        { name: 'Decision Trees', description: 'Interpretable models for classification' },
        { name: 'Loss Functions', description: 'Measuring model prediction errors' },
        { name: 'Regularization', description: 'Preventing overfitting in models' },
      ],
    },
    {
      id: 'transformers',
      title: 'Transformer Architecture',
      description: 'Modern deep learning models for sequences',
      topics: [
        { name: 'Tokenization', description: 'Converting text to processable units' },
        { name: 'Embeddings', description: 'Dense vector representations of tokens' },
        { name: 'Positional Encoding', description: 'Encoding position information' },
        { name: 'Self-Attention', description: 'The core attention mechanism' },
        { name: 'Multi-Head Attention', description: 'Parallel attention computation' },
        { name: 'Feed-Forward Networks', description: 'Non-linear transformations' },
      ],
    },
    {
      id: 'rag',
      title: 'Retrieval-Augmented Generation',
      description: 'Modern systems combining retrieval with generation',
      topics: [
        { name: 'Vector Embeddings', description: 'Converting documents to searchable vectors' },
        { name: 'Semantic Search', description: 'Finding relevant documents by meaning' },
        { name: 'Reranking', description: 'Improving retrieval result order' },
        { name: 'Prompt Engineering', description: 'Crafting effective prompts with context' },
        { name: 'Knowledge Bases', description: 'Organizing documents for efficient search' },
        { name: 'Multimodal RAG', description: 'Combining text, images, and structured data' },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Learning Guide</h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive documentation for understanding neural networks, machine learning
              algorithms, and transformers. Each section includes visual explanations and
              interactive examples.
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-20">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">{section.title}</h2>
                  <p className="text-muted-foreground">{section.description}</p>
                </div>

                <div className="space-y-3">
                  {section.topics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{topic.name}</h3>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground mt-0.5" />
                      </div>
                    </div>
                  ))}
                </div>

                {section.id === 'neural-networks' && (
                  <div className="mt-6 bg-primary/10 border border-primary/30 rounded-lg p-6">
                    <h4 className="font-bold text-foreground mb-3">Key Concepts</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground mb-1">Universal Approximation</p>
                        <p className="text-muted-foreground">
                          Neural networks can approximate any continuous function with enough hidden
                          units.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Non-linearity Importance</p>
                        <p className="text-muted-foreground">
                          Activation functions enable networks to learn complex, non-linear
                          relationships.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Chain Rule</p>
                        <p className="text-muted-foreground">
                          Backpropagation uses the chain rule to compute gradients efficiently.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Local Minima</p>
                        <p className="text-muted-foreground">
                          Gradient descent finds local minima; deeper networks are more prone to
                          this.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {section.id === 'ml-algorithms' && (
                  <div className="mt-6 bg-accent/10 border border-accent/30 rounded-lg p-6">
                    <h4 className="font-bold text-foreground mb-3">Algorithm Comparison</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground mb-1">Supervised vs Unsupervised</p>
                        <p className="text-muted-foreground">
                          Supervised algorithms need labels; unsupervised algorithms find patterns
                          without labels.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Convergence</p>
                        <p className="text-muted-foreground">
                          Learning rate affects how quickly algorithms converge to optimal
                          solutions.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Scalability</p>
                        <p className="text-muted-foreground">
                          Different algorithms scale differently with dataset size and feature
                          count.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Interpretability</p>
                        <p className="text-muted-foreground">
                          Some algorithms are more interpretable than others; trade-off with
                          accuracy.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {section.id === 'transformers' && (
                  <div className="mt-6 bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
                    <h4 className="font-bold text-foreground mb-3">Transformer Innovations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground mb-1">Parallel Processing</p>
                        <p className="text-muted-foreground">
                          Unlike RNNs, transformers process sequences in parallel, enabling faster
                          training.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Long-Range Dependencies</p>
                        <p className="text-muted-foreground">
                          Attention mechanisms naturally capture relationships between distant
                          tokens.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Scalability</p>
                        <p className="text-muted-foreground">
                          Transformers scale well to very large models and datasets; GPT-3 has 175B
                          parameters.
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground mb-1">Transfer Learning</p>
                        <p className="text-muted-foreground">
                          Pre-trained transformers can be fine-tuned for many downstream tasks
                          effectively.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16 pt-12 border-t border-border">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  q: 'What\'s the difference between neural networks and deep learning?',
                  a: 'Neural networks are models with multiple layers; deep learning refers to neural networks with many layers (typically 3+). All deep learning uses neural networks, but not all neural networks are deep.',
                },
                {
                  q: 'Why do we need activation functions?',
                  a: 'Without activation functions, neural networks are just linear transformations of their inputs. Activation functions introduce non-linearity, enabling networks to learn complex patterns.',
                },
                {
                  q: 'What is backpropagation?',
                  a: 'Backpropagation is the algorithm for training neural networks. It computes gradients of the loss with respect to all parameters by applying the chain rule backward through the network.',
                },
                {
                  q: 'How does gradient descent work?',
                  a: 'Gradient descent iteratively updates parameters in the direction opposite to the gradient of the loss function, moving toward lower loss values (optimal solutions).',
                },
                {
                  q: 'What makes transformers different from RNNs?',
                  a: 'Transformers use attention mechanisms to process sequences, enabling parallel computation. RNNs process sequences sequentially, making them slower but potentially better for certain sequential dependencies.',
                },
                {
                  q: 'Why is positional encoding needed in transformers?',
                  a: 'Transformers lack inherent sequential bias. Positional encoding adds information about token positions, allowing the model to understand word order and sequence structure.',
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-2">{item.q}</h3>
                  <p className="text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Vector Models Reference */}
          <div className="mt-16 pt-16 border-t border-border">
            <h2 className="text-3xl font-bold text-foreground mb-2">Advanced: Multi-Vector Models</h2>
            <p className="text-foreground/60 mb-8">Learn about modern embedding models that use multiple vector representations</p>
            <div className="bg-card border border-border rounded-lg p-6 overflow-auto">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Kx8bFNsLuZyH6av3soUu98UnM5jqZO.png"
                alt="Multi-Vector Models - Late Interaction, Dense Vector vs Multi Vector, ColBERT, ColPali, and ColQwen architectures with embedding dimensions and patch sizes"
                className="w-full max-w-6xl mx-auto rounded-lg bg-white/5"
              />
              <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-foreground/70 text-center">
                  <span className="font-semibold">Source:</span> Multi-Vector Models - ColBERT, ColPali, and ColQwen Architectures
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Experiment?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Head to the Interactive Playground to experiment with all these concepts in action.
              Adjust parameters and see how your changes affect model behavior in real-time.
            </p>
            <Link
              href="/playground"
              className="inline-block px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Go to Playground
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
