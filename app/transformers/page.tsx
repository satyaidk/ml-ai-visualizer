'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { TransformerCanvas } from '@/components/transformer-canvas';
import { initializeTransformerState, transformerBlock, TransformerState } from '@/lib/transformers';

type VisualizationType = 'attention' | 'embedding' | 'architecture';

export default function TransformersPage() {
  const [inputText, setInputText] = useState('the quick brown fox');
  const [transformerState, setTransformerState] = useState<TransformerState>(() =>
    initializeTransformerState(inputText, 8)
  );
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('attention');
  const [currentLayer, setCurrentLayer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showArchDiagram, setShowArchDiagram] = useState(false);

  const handleInputChange = (text: string) => {
    setInputText(text);
    setTransformerState(initializeTransformerState(text, 8));
    setProcessingStep(0);
  };

  const processLayer = () => {
    if (currentLayer < 3) {
      setIsProcessing(true);
      setTimeout(() => {
        const newState = { ...transformerState };
        // Simulate processing through a transformer block
        newState.embedding = newState.embedding.map((emb) =>
          transformerBlock(emb, newState.embedding, newState.embedding, 4)
        );
        setTransformerState(newState);
        setCurrentLayer((prev) => prev + 1);
        setProcessingStep((prev) => prev + 1);
        setIsProcessing(false);
      }, 500);
    }
  };

  const reset = () => {
    setTransformerState(initializeTransformerState(inputText, 8));
    setCurrentLayer(0);
    setProcessingStep(0);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Transformer Architecture</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore the inner workings of the transformer architecture. Visualize attention
              mechanisms, embeddings, positional encoding, and how data flows through multi-head
              attention and feed-forward networks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg">
                    {visualizationType === 'attention'
                      ? 'Attention Heatmap'
                      : visualizationType === 'embedding'
                        ? 'Embedding Space'
                        : 'Architecture Flow'}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    Layer: {currentLayer} / 3
                  </span>
                </div>

                <TransformerCanvas
                  state={transformerState}
                  width={600}
                  height={400}
                  visualizationType={visualizationType}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Visualization Type */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Visualization</h3>

                <div className="space-y-2">
                  {[
                    { id: 'attention', label: 'Attention Heatmap' },
                    { id: 'embedding', label: 'Embedding Space' },
                    { id: 'architecture', label: 'Architecture' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setVisualizationType(item.id as VisualizationType)}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        visualizationType === item.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Text */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Input Text</h3>

                <div className="space-y-3">
                  <textarea
                    value={inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none"
                    rows={3}
                    placeholder="Enter text to process..."
                  />

                  <div className="text-xs text-muted-foreground">
                    Tokens: {transformerState.tokens.length}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border">
                    <button
                      onClick={processLayer}
                      disabled={isProcessing || currentLayer >= 3}
                      className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-opacity text-sm"
                    >
                      {isProcessing ? 'Processing...' : 'Process Layer'}
                    </button>
                    <button
                      onClick={reset}
                      className="flex-1 px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors text-sm"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Token Details */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Tokens</h3>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {transformerState.tokens.map((token, idx) => (
                    <div
                      key={token.id}
                      className="p-2 rounded bg-secondary/50 text-sm border-l-2 border-primary"
                    >
                      <div className="font-medium">{token.value}</div>
                      <div className="text-xs text-muted-foreground">
                        Pos: {idx} | Embedding: {transformerState.embedding[idx].slice(0, 2).map((v) => v.toFixed(2)).join(', ')}...
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: 'Tokenization',
                description:
                  'Input text is split into tokens (words or subwords) that can be processed by the model.',
              },
              {
                title: 'Embedding',
                description:
                  'Each token is converted to a dense vector representation using learned embeddings.',
              },
              {
                title: 'Positional Encoding',
                description:
                  'Information about token position is added to embeddings so the model understands word order.',
              },
              {
                title: 'Attention',
                description:
                  'Tokens learn to focus on relevant tokens via scaled dot-product attention computed in parallel heads.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-bold mb-2 text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Detailed Explanation */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">How Transformers Work</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-3 text-primary">Self-Attention Mechanism</h3>
                <p className="text-muted-foreground mb-4">
                  The core innovation of transformers is self-attention. For each token, the model
                  computes three vectors: Query, Key, and Value. Attention scores are calculated as
                  a similarity measure between queries and keys, then used to weight the values.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Enables parallel processing of sequences</li>
                  <li>✓ Captures long-range dependencies</li>
                  <li>✓ Provides interpretable attention weights</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-primary">Multi-Head Attention</h3>
                <p className="text-muted-foreground mb-4">
                  Instead of single attention, multiple independent attention heads operate in
                  parallel. Each head learns different aspects of relationships between tokens. The
                  outputs are concatenated to form the final attention output.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Allows diverse representation learning</li>
                  <li>✓ Different heads focus on different parts of input</li>
                  <li>✓ Improves model capacity and robustness</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-primary">Residual Connections</h3>
                <p className="text-muted-foreground mb-4">
                  Skip connections allow gradients to flow directly through deep networks. This
                  stabilizes training and enables very deep architectures. Combined with layer
                  normalization for better training dynamics.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Enables training of very deep networks</li>
                  <li>✓ Prevents vanishing gradient problem</li>
                  <li>✓ Improves gradient flow during backprop</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3 text-primary">Feed-Forward Networks</h3>
                <p className="text-muted-foreground mb-4">
                  After attention, each token passes through a position-wise feed-forward network.
                  This is typically a two-layer network with an intermediate layer much larger than
                  the embedding dimension, providing non-linearity and expressiveness.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Adds non-linearity to the model</li>
                  <li>✓ Processes each position independently</li>
                  <li>✓ Increases model expressiveness</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transformer Architecture Diagram */}
          <div className="mt-16 pt-16 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Transformer Architecture Diagram</h2>
                <p className="text-foreground/60 text-sm">Complete encoder-decoder structure with all components</p>
              </div>
              <button
                onClick={() => setShowArchDiagram(!showArchDiagram)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
              >
                {showArchDiagram ? 'Hide Diagram' : 'Show Diagram'}
              </button>
            </div>
            
            {showArchDiagram && (
              <div className="bg-card border border-border rounded-lg p-6 overflow-auto">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9o3QFxX8lE51YLnMnpvLAG0cq40IYK.png"
                  alt="Transformer Architecture - Encoder-Decoder structure showing Input/Output Embeddings, Positional Encoding, Multi-Head Attention, Feed Forward, Add & Norm layers, and Softmax output"
                  className="w-full max-w-4xl mx-auto rounded-lg bg-white/5"
                />
                <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                  <p className="text-sm text-foreground/70 text-center">
                    <span className="font-semibold">Source:</span> "Attention Is All You Need" - Transformer Model Architecture
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
