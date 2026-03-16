'use client';

import { Navigation } from '@/components/navigation';
import { Glossary, GlossaryTerm } from '@/components/glossary';

export default function GlossaryPage() {
  const neuralNetworkTerms: GlossaryTerm[] = [
    {
      term: 'Neuron',
      definition:
        'The fundamental unit of a neural network that receives inputs, applies weights, adds bias, and passes through an activation function.',
      example: 'output = activation(sum(weights * inputs) + bias)',
    },
    {
      term: 'Layer',
      definition:
        'A collection of neurons that process information in parallel. Common types: input, hidden, and output layers.',
    },
    {
      term: 'Weight',
      definition:
        'A learnable parameter that scales the importance of an input to a neuron. Weights are updated during training.',
    },
    {
      term: 'Bias',
      definition:
        'A learnable offset term added to each neuron before the activation function. Allows neurons to shift their activation functions.',
    },
    {
      term: 'Activation Function',
      definition:
        'A non-linear function applied to neuron outputs. Common types: ReLU, Sigmoid, Tanh. Enables networks to learn complex patterns.',
      example: 'ReLU(x) = max(0, x)',
    },
    {
      term: 'Forward Propagation',
      definition:
        'The process of passing input data through the network to produce predictions. Data flows from input to output layer.',
    },
    {
      term: 'Backpropagation',
      definition:
        'The algorithm for training neural networks by computing gradients of the loss with respect to all parameters using the chain rule.',
    },
    {
      term: 'Gradient Descent',
      definition:
        'An optimization algorithm that updates parameters by moving in the direction opposite to the gradient, reducing loss over time.',
    },
    {
      term: 'Loss Function',
      definition:
        'A function that measures the difference between predicted and actual outputs. The goal of training is to minimize loss.',
      example: 'Mean Squared Error (MSE) = mean((predicted - actual)²)',
    },
    {
      term: 'Learning Rate',
      definition:
        'A hyperparameter that controls the step size during gradient descent. Higher rates train faster but may overshoot; lower rates are more stable but slower.',
    },
  ];

  const mlAlgorithmTerms: GlossaryTerm[] = [
    {
      term: 'Supervised Learning',
      definition:
        'Learning from labeled data where the model learns to map inputs to known outputs. Examples: classification, regression.',
    },
    {
      term: 'Unsupervised Learning',
      definition:
        'Learning from unlabeled data to discover hidden patterns and structure. Examples: clustering, dimensionality reduction.',
    },
    {
      term: 'Clustering',
      definition:
        'An unsupervised learning task where data points are grouped into clusters based on similarity. Example: K-Means.',
    },
    {
      term: 'K-Means',
      definition:
        'An unsupervised clustering algorithm that partitions data into k clusters by iteratively assigning points to nearest centroids and updating centroids.',
    },
    {
      term: 'Centroid',
      definition:
        'The center point of a cluster in K-Means, calculated as the mean position of all points in the cluster.',
    },
    {
      term: 'Classification',
      definition:
        'A supervised learning task to predict which category an input belongs to. Examples: spam detection, image recognition.',
    },
    {
      term: 'Regression',
      definition:
        'A supervised learning task to predict continuous numerical values. Example: predicting house prices from features.',
    },
    {
      term: 'Decision Tree',
      definition:
        'A model that makes predictions by recursively splitting data based on features. Interpretable but prone to overfitting.',
    },
    {
      term: 'Feature',
      definition:
        'An individual measurable property or input variable used by a model. Feature engineering improves model performance.',
    },
    {
      term: 'Overfitting',
      definition:
        'When a model learns training data too well, including noise, and performs poorly on new data. Prevent with regularization.',
    },
  ];

  const transformerTerms: GlossaryTerm[] = [
    {
      term: 'Token',
      definition:
        'A unit of text processed by a transformer, typically a word or subword. Text is first tokenized before processing.',
    },
    {
      term: 'Embedding',
      definition:
        'A dense vector representation of a token learned during training. Similar tokens have similar embeddings.',
    },
    {
      term: 'Positional Encoding',
      definition:
        'Information added to embeddings about token position in the sequence. Enables the model to understand word order.',
    },
    {
      term: 'Attention',
      definition:
        'A mechanism that computes weighted relationships between all tokens in a sequence. Core component of transformers.',
    },
    {
      term: 'Query, Key, Value',
      definition:
        'Three vectors derived from each token used in attention computation. Query matches with Keys to determine which Values to use.',
    },
    {
      term: 'Attention Score',
      definition:
        'A measure of similarity between a query and a key, computed as scaled dot product. Used to weight values in attention.',
    },
    {
      term: 'Softmax',
      definition:
        'A function that converts raw scores to a probability distribution (0-1, sum to 1). Used to normalize attention weights.',
    },
    {
      term: 'Multi-Head Attention',
      definition:
        'Multiple attention mechanisms running in parallel, each focusing on different aspects. Outputs are concatenated.',
    },
    {
      term: 'Self-Attention',
      definition:
        'Attention where a token attends to all tokens in the same sequence, including itself. Core of transformer architecture.',
    },
    {
      term: 'Feed-Forward Network',
      definition:
        'A small neural network applied to each token independently after attention. Adds non-linearity and expressiveness.',
    },
    {
      term: 'Residual Connection',
      definition:
        'A skip connection that bypasses layers, adding input to output. Enables deep networks and improves gradient flow.',
    },
    {
      term: 'Layer Normalization',
      definition:
        'Normalizes activations across features for each sample. Used in transformers to stabilize training.',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Glossary of Terms</h1>
            <p className="text-lg text-muted-foreground">
              A comprehensive dictionary of terms used in neural networks, machine learning, and
              transformers. Click each term to expand its definition.
            </p>
          </div>

          {/* Neural Networks Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-primary">Neural Networks</h2>
            <Glossary terms={neuralNetworkTerms} />
          </div>

          {/* ML Algorithms Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-accent">Machine Learning Algorithms</h2>
            <Glossary terms={mlAlgorithmTerms} />
          </div>

          {/* Transformers Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-orange-500">Transformers</h2>
            <Glossary terms={transformerTerms} />
          </div>

          {/* General ML Terms */}
          <div>
            <h2 className="text-2xl font-bold mb-6">General Machine Learning</h2>
            <Glossary
              terms={[
                {
                  term: 'Model',
                  definition:
                    'A mathematical function learned from data that makes predictions. Consists of learnable parameters.',
                },
                {
                  term: 'Training',
                  definition:
                    'The process of adjusting model parameters to minimize loss on training data using an optimization algorithm.',
                },
                {
                  term: 'Validation',
                  definition:
                    'Evaluation on a separate dataset during training to monitor performance and detect overfitting.',
                },
                {
                  term: 'Testing',
                  definition:
                    'Final evaluation on held-out data to assess model performance on unseen examples.',
                },
                {
                  term: 'Hyperparameter',
                  definition:
                    'A parameter set before training (not learned). Examples: learning rate, network architecture, batch size.',
                },
                {
                  term: 'Epoch',
                  definition:
                    'One complete pass through the entire training dataset. Training typically requires multiple epochs.',
                },
                {
                  term: 'Batch Size',
                  definition:
                    'The number of training examples processed before updating model parameters. Affects memory usage and gradient stability.',
                },
                {
                  term: 'Gradient',
                  definition:
                    'The direction and magnitude of change in loss with respect to parameters. Used to update parameters in optimization.',
                },
                {
                  term: 'Convergence',
                  definition:
                    'When optimization reaches a point where loss stops decreasing significantly. Model has learned what it can.',
                },
                {
                  term: 'Regularization',
                  definition:
                    'Techniques to prevent overfitting by constraining model complexity. Examples: L1/L2 penalty, dropout.',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
