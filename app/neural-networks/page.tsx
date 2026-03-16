'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { NeuralNetworkCanvas } from '@/components/neural-network-canvas';
import {
  createNetwork,
  forwardPass,
  calculateMSE,
  backpropagationStep,
  NetworkConfig,
} from '@/lib/neural-network';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

export default function NeuralNetworksPage() {
  const [config, setConfig] = useState<NetworkConfig>({
    layers: [2, 4, 3, 1],
    learningRate: 0.1,
    activation: 'sigmoid',
  });
  const [showArchitectures, setShowArchitectures] = useState(false);

  const [network, setNetwork] = useState(() => createNetwork(config));
  const [trainingData, setTrainingData] = useState(() => [
    { input: [0, 0], output: [0] },
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [0] },
  ]);

  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(0);
  const [speed, setSpeed] = useState(50);

  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setEpoch((prev) => prev + 1);

      let totalLoss = 0;
      let { neurons, connections } = network;

      trainingData.forEach(({ input, output }) => {
        const updated = forwardPass(neurons, connections, input, config.activation);
        const outputNeurons = updated.filter((n) => n.layer === config.layers.length - 1);
        const outputValues = outputNeurons.map((n) => n.value);

        totalLoss += calculateMSE(outputValues, output);

        const result = backpropagationStep(
          updated,
          connections,
          output,
          config.learningRate
        );
        neurons = result.neurons;
        connections = result.connections;
      });

      setLoss(totalLoss / trainingData.length);
      setNetwork({ neurons, connections });
    }, 100 - speed);

    return () => clearInterval(interval);
  }, [isTraining, network, trainingData, config, speed]);

  const handleReset = () => {
    setNetwork(createNetwork(config));
    setEpoch(0);
    setLoss(0);
    setIsTraining(false);
  };

  const handleLayersChange = (newLayers: number[]) => {
    setConfig((prev) => ({ ...prev, layers: newLayers }));
    setNetwork(createNetwork({ ...config, layers: newLayers }));
    setEpoch(0);
    setLoss(0);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Neural Networks</h1>
            <p className="text-muted-foreground max-w-2xl">
              Understand how artificial neural networks work by visualizing the forward pass,
              backpropagation, and weight updates. Watch the network learn to solve the XOR
              problem in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualization */}
            <div className="lg:col-span-2">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="font-bold text-lg mb-4">Network Architecture</h2>
                <NeuralNetworkCanvas
                  neurons={network.neurons}
                  connections={network.connections}
                  width={600}
                  height={400}
                />
                <div className="mt-4 flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Total parameters:{' '}
                    {network.neurons.length +
                      network.connections.length}
                  </span>
                  <span className="text-muted-foreground">
                    Activation: {config.activation}
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Training Status */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Training Status</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Epoch</p>
                    <p className="text-3xl font-bold text-primary">{epoch}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Loss (MSE)</p>
                    <p className="text-3xl font-bold text-accent">{loss.toFixed(4)}</p>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => setIsTraining(!isTraining)}
                      className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      {isTraining ? (
                        <>
                          <Pause className="w-4 h-4" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Train
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Network Configuration */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-bold text-lg mb-4">Configuration</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Learning Rate: {config.learningRate.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.01"
                      max="1"
                      step="0.01"
                      value={config.learningRate}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          learningRate: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Speed: {speed}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={speed}
                      onChange={(e) => setSpeed(parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Activation
                    </label>
                    <select
                      value={config.activation}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          activation: e.target.value as 'sigmoid' | 'relu' | 'tanh',
                        }))
                      }
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground"
                    >
                      <option value="sigmoid">Sigmoid</option>
                      <option value="relu">ReLU</option>
                      <option value="tanh">Tanh</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-3">Network Layers</p>
                    <div className="space-y-2">
                      {config.layers.map((size, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-16">
                            {idx === 0
                              ? 'Input'
                              : idx === config.layers.length - 1
                                ? 'Output'
                                : `Hidden ${idx}`}
                          </span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={size}
                            onChange={(e) => {
                              const newLayers = [...config.layers];
                              newLayers[idx] = parseInt(e.target.value) || 1;
                              handleLayersChange(newLayers);
                            }}
                            className="w-12 px-2 py-1 rounded bg-background border border-border text-foreground text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <div className="flex gap-2">
                  <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-1">Learning the XOR Problem</p>
                    <p className="text-muted-foreground text-xs">
                      This network learns to output 1 when inputs differ, 0 when they match.
                      Adjust parameters to see how they affect training speed and convergence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Forward Pass',
                description:
                  'Input flows through each layer, multiplied by weights and biases, then activated with a non-linear function.',
              },
              {
                title: 'Backpropagation',
                description:
                  'The error is calculated at the output and propagated backward, computing gradients for each weight.',
              },
              {
                title: 'Weight Update',
                description:
                  'Weights are adjusted in the opposite direction of the gradient by the learning rate to minimize loss.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Neural Network Architectures Reference */}
        <section className="mt-16 pt-16 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Neural Network Architectures</h2>
              <p className="text-foreground/60 text-sm">Explore 30+ types of neural network architectures and their variations</p>
            </div>
            <button
              onClick={() => setShowArchitectures(!showArchitectures)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
            >
              {showArchitectures ? 'Hide Chart' : 'Show Chart'}
            </button>
          </div>
          
          {showArchitectures && (
            <div className="bg-card border border-border rounded-lg p-6 overflow-auto">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GaSVXKtJZ3SSq9Y3M1bVG5OryZD8t7.png"
                alt="Neural Network Architectures Chart - A comprehensive overview of 30+ neural network types including CNNs, RNNs, LSTMs, GANs, Transformers and more"
                className="w-full max-w-6xl mx-auto rounded-lg bg-white/5 p-4"
              />
              <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-foreground/70 text-center">
                  <span className="font-semibold">Source:</span> © 2019 Fjodor van Veen & Stefan Leijnen - asimovinstitute.org
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
