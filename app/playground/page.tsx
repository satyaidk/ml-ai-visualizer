'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { NeuralNetworkCanvas } from '@/components/neural-network-canvas';
import { MLCanvas } from '@/components/ml-canvas';
import { TransformerCanvas } from '@/components/transformer-canvas';
import {
  createNetwork,
  forwardPass,
  NetworkConfig,
} from '@/lib/neural-network';
import {
  generateRegressionData,
  initializeRegressionLine,
  gradientDescentStep,
  generateClusterData,
  initializeCentroids,
  kMeansStep,
} from '@/lib/ml-algorithms';
import { initializeTransformerState, TransformerState } from '@/lib/transformers';
import { Zap, RotateCcw } from 'lucide-react';

type ExperimentType = 'neural-network' | 'gradient-descent' | 'kmeans' | 'transformers' | 'rag';

export default function PlaygroundPage() {
  const [experimentType, setExperimentType] = useState<ExperimentType>('neural-network');

  // Neural Network State
  const [nnConfig, setNNConfig] = useState<NetworkConfig>({
    layers: [3, 6, 4, 2],
    learningRate: 0.1,
    activation: 'sigmoid',
  });
  const [nnNetwork, setNNNetwork] = useState(() => createNetwork(nnConfig));
  const [nnInputs, setNNInputs] = useState([0.5, 0.5, 0.5]);

  // Gradient Descent State
  const [gdData] = useState(() => generateRegressionData(50));
  const [gdLine, setGdLine] = useState(() => initializeRegressionLine());
  const [gdLR, setGdLR] = useState(0.01);
  const [gdIterations, setGdIterations] = useState(0);

  // K-Means State
  const [kmData, setKmData] = useState(() => generateClusterData(3, 30));
  const [kmCentroids, setKmCentroids] = useState(() =>
    initializeCentroids(3, { minX: -15, maxX: 15, minY: -15, maxY: 15 })
  );
  const [kmK, setKmK] = useState(3);

  // Transformer State
  const [tsText, setTsText] = useState('hello world');
  const [tsState] = useState<TransformerState>(() => initializeTransformerState(tsText, 8));

  // Handlers
  const handleNNLayerChange = (index: number, value: number) => {
    const newLayers = [...nnConfig.layers];
    newLayers[index] = Math.max(1, value);
    const newConfig = { ...nnConfig, layers: newLayers };
    setNNConfig(newConfig);
    setNNNetwork(createNetwork(newConfig));
  };

  const handleNNInputChange = (index: number, value: number) => {
    const newInputs = [...nnInputs];
    newInputs[index] = value;
    setNNInputs(newInputs);

    // Forward pass
    const updated = forwardPass(nnNetwork.neurons, nnNetwork.connections, newInputs, nnConfig.activation);
    setNNNetwork({ ...nnNetwork, neurons: updated });
  };

  const handleGDStep = (steps: number = 1) => {
    let line = gdLine;
    for (let i = 0; i < steps; i++) {
      line = gradientDescentStep(line, gdData, gdLR);
    }
    setGdLine(line);
    setGdIterations((prev) => prev + steps);
  };

  const handleKMStep = (steps: number = 1) => {
    let data = kmData;
    let centroids = kmCentroids;
    for (let i = 0; i < steps; i++) {
      const result = kMeansStep(data, centroids);
      data = result.points;
      centroids = result.centroids;
    }
    setKmData(data);
    setKmCentroids(centroids);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Interactive Playground</h1>
            <p className="text-muted-foreground max-w-2xl">
              Experiment with different ML and AI models. Adjust parameters in real-time, observe
              behavior, and build intuition about how these systems work.
            </p>
          </div>

          {/* Experiment Selector */}
          <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto pb-4">
            {[
              { id: 'neural-network', label: 'Neural Network' },
              { id: 'gradient-descent', label: 'Gradient Descent' },
              { id: 'kmeans', label: 'K-Means' },
              { id: 'transformers', label: 'Transformers' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setExperimentType(item.id as ExperimentType)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  experimentType === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Neural Network Experiment */}
          {experimentType === 'neural-network' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Network Visualization</h2>
                  <NeuralNetworkCanvas
                    neurons={nnNetwork.neurons}
                    connections={nnNetwork.connections}
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold mb-4">Network Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Learning Rate</label>
                      <input
                        type="range"
                        min="0.01"
                        max="1"
                        step="0.01"
                        value={nnConfig.learningRate}
                        onChange={(e) =>
                          setNNConfig((prev) => ({
                            ...prev,
                            learningRate: parseFloat(e.target.value),
                          }))
                        }
                        className="w-full accent-primary"
                      />
                      <span className="text-xs text-muted-foreground">{nnConfig.learningRate.toFixed(2)}</span>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Activation Function</label>
                      <select
                        value={nnConfig.activation}
                        onChange={(e) =>
                          setNNConfig((prev) => ({
                            ...prev,
                            activation: e.target.value as 'sigmoid' | 'relu' | 'tanh',
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm"
                      >
                        <option value="sigmoid">Sigmoid</option>
                        <option value="relu">ReLU</option>
                        <option value="tanh">Tanh</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <label className="text-sm font-medium mb-3 block">Layer Sizes</label>
                      <div className="space-y-2">
                        {nnConfig.layers.map((size, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-12">L{idx}</span>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={size}
                              onChange={(e) =>
                                handleNNLayerChange(idx, parseInt(e.target.value) || 1)
                              }
                              className="flex-1 px-2 py-1 rounded bg-background border border-border text-foreground text-sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold mb-4">Input Values</h3>
                  <div className="space-y-3">
                    {nnInputs.map((value, idx) => (
                      <div key={idx}>
                        <label className="text-sm font-medium mb-2 block">
                          Input {idx}: {value.toFixed(2)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={value}
                          onChange={(e) => handleNNInputChange(idx, parseFloat(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gradient Descent Experiment */}
          {experimentType === 'gradient-descent' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Regression Optimization</h2>
                  <MLCanvas
                    points={gdData}
                    type="gradient-descent"
                    regressionLine={gdLine}
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold mb-4">Training Stats</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Iterations</p>
                      <p className="text-2xl font-bold text-primary">{gdIterations}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Loss</p>
                      <p className="text-2xl font-bold text-accent">{gdLine.loss.toFixed(4)}</p>
                    </div>
                    <div className="text-xs font-mono space-y-1 pt-3 border-t border-border">
                      <p>Slope: {gdLine.slope.toFixed(3)}</p>
                      <p>Intercept: {gdLine.intercept.toFixed(3)}</p>
                    </div>

                    <div className="flex gap-2 pt-3">
                      <button
                        onClick={() => handleGDStep(1)}
                        className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm"
                      >
                        Step
                      </button>
                      <button
                        onClick={() => handleGDStep(10)}
                        className="flex-1 px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors text-sm"
                      >
                        10 Steps
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold mb-4">Configuration</h3>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Learning Rate</label>
                    <input
                      type="range"
                      min="0.0001"
                      max="0.1"
                      step="0.0001"
                      value={gdLR}
                      onChange={(e) => setGdLR(parseFloat(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <span className="text-xs text-muted-foreground">{gdLR.toFixed(5)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* K-Means Experiment */}
          {experimentType === 'kmeans' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Interactive K-Means</h2>
                  <MLCanvas
                    points={kmData}
                    type="kmeans"
                    centroids={kmCentroids}
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold mb-4">Controls</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Number of Clusters: {kmK}</label>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        value={kmK}
                        onChange={(e) => {
                          const k = parseInt(e.target.value);
                          setKmK(k);
                          setKmData(generateClusterData(k, 30));
                          setKmCentroids(initializeCentroids(k, { minX: -15, maxX: 15, minY: -15, maxY: 15 }));
                        }}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-border">
                      <button
                        onClick={() => handleKMStep(1)}
                        className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm"
                      >
                        Step
                      </button>
                      <button
                        onClick={() => handleKMStep(5)}
                        className="flex-1 px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors text-sm"
                      >
                        5 Steps
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transformers Experiment */}
          {experimentType === 'transformers' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Transformer Attention</h2>
                  <TransformerCanvas
                    state={tsState}
                    width={600}
                    height={400}
                    visualizationType="attention"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold mb-4">Input Text</h3>
                  <textarea
                    value={tsText}
                    onChange={(e) => setTsText(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm resize-none"
                    rows={3}
                    placeholder="Enter text..."
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    Tokens: {tsState.tokens.length}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold mb-4">Tokens</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {tsState.tokens.map((token) => (
                      <div key={token.id} className="px-2 py-1 rounded bg-secondary/50 text-xs">
                        <span className="font-medium">{token.value}</span>
                        <span className="text-muted-foreground ml-2">pos: {token.position}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-12 bg-accent/10 border border-accent/30 rounded-lg p-6">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-foreground mb-2">Playground Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Adjust parameters and watch how the model behavior changes in real-time</li>
                  <li>• Experiment with different learning rates and observe convergence speed</li>
                  <li>• Try different network architectures to understand their impact</li>
                  <li>• Combine what you learn across different modules for deeper understanding</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
