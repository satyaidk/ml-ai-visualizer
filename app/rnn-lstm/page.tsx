'use client';

import { useState, useEffect } from 'react';
import { SimpleRNN, LSTMCell, generateTimeSeriesData, timeSeriestoSequences } from '@/lib/rnn-lstm-models';

export default function RNNLSTMPage() {
  const [activeTab, setActiveTab] = useState<'rnn' | 'lstm'>('lstm');
  const [hiddenSize, setHiddenSize] = useState(16);
  const [seqLength, setSeqLength] = useState(10);
  const [hiddenStates, setHiddenStates] = useState<number[][]>([]);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [trainingProgress, setTrainingProgress] = useState(0);

  useEffect(() => {
    // Generate sample time series data
    const timeSeriesData = generateTimeSeriesData(100, 0.1, 0.05);
    const sequences = timeSeriestoSequences(timeSeriesData, seqLength, 1);

    if (sequences.length === 0) return;

    // Initialize model
    if (activeTab === 'lstm') {
      const lstm = new LSTMCell({
        inputSize: 1,
        hiddenSize,
        outputSize: 1,
        learningRate: 0.01,
      });

      // Forward pass on first sequence
      const sequence = sequences[0].input;
      const result = lstm.forwardSequence(sequence);
      setHiddenStates(result.hiddenStates);
      setPredictions(result.outputs.map((o) => o[0]));
    } else {
      const rnn = new SimpleRNN({
        inputSize: 1,
        hiddenSize,
        outputSize: 1,
        learningRate: 0.01,
      });

      const sequence = sequences[0].input;
      const result = rnn.forwardSequence(sequence);
      setHiddenStates(result.hiddenStates);
      setPredictions(result.outputs.map((o) => o[0]));
    }

    setTrainingProgress(45);
  }, [activeTab, hiddenSize, seqLength]);

  const maxHiddenValue = Math.max(...hiddenStates.flat().map(Math.abs));

  return (
    <main className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sequence Modeling with RNN & LSTM</h1>
          <p className="text-muted-foreground max-w-2xl">
            See how recurrent neural networks learn patterns in sequential data. LSTM cells use gates to control information flow better than simple RNNs.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('rnn')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'rnn'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Simple RNN
          </button>
          <button
            onClick={() => setActiveTab('lstm')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'lstm'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            LSTM (Recommended)
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-card p-6 rounded-lg border border-border">
          <div>
            <label className="text-sm font-medium">Hidden Size: {hiddenSize}</label>
            <input
              type="range"
              min="4"
              max="32"
              value={hiddenSize}
              onChange={(e) => setHiddenSize(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Sequence Length: {seqLength}</label>
            <input
              type="range"
              min="5"
              max="20"
              value={seqLength}
              onChange={(e) => setSeqLength(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>

        {/* Main Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Hidden State Evolution */}
          <div className="lg:col-span-2 bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold mb-4">Hidden State Evolution (Over Time)</h2>
            <div className="bg-secondary/50 rounded-lg p-4 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {hiddenStates.map((hidden, t) => (
                  <div key={t} className="flex flex-col gap-px" title={`Time step ${t}`}>
                    {hidden.slice(0, Math.min(8, hidden.length)).map((val, i) => {
                      const normalized = (val + maxHiddenValue) / (2 * maxHiddenValue);
                      const intensity = Math.floor(normalized * 255);
                      return (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-xs"
                          style={{
                            backgroundColor: `rgb(${intensity}, ${255 - intensity}, 100)`,
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Each column shows hidden state values at one time step (8 of {hiddenSize} units shown)
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold mb-4">Model Info</h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground">Model Type</div>
                <div className="font-semibold">{activeTab === 'lstm' ? 'LSTM Cell' : 'Simple RNN'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Hidden Units</div>
                <div className="font-semibold">{hiddenSize}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Sequence Length</div>
                <div className="font-semibold">{seqLength}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Training Progress</div>
                <div className="bg-secondary rounded-full h-2 mt-1 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Tip:</strong> LSTM uses "gates" to control when to remember or forget information, solving the vanishing gradient problem.
              </p>
            </div>
          </div>
        </div>

        {/* Prediction Output */}
        <div className="bg-card p-6 rounded-lg border border-border mb-8">
          <h2 className="text-lg font-bold mb-4">Predicted Output Sequence</h2>
          <div className="bg-secondary/50 rounded-lg p-4 h-48">
            <svg className="w-full h-full" viewBox={`0 0 ${predictions.length * 40} 200`}>
              {/* Grid lines */}
              {predictions.map((_, i) => (
                <line
                  key={`grid-${i}`}
                  x1={i * 40}
                  y1="0"
                  x2={i * 40}
                  y2="200"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="1"
                />
              ))}

              {/* Prediction line */}
              {predictions.length > 1 && (
                <polyline
                  points={predictions.map((val, i) => `${i * 40},${200 - val * 200}`).join(' ')}
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  className="text-primary"
                />
              )}

              {/* Data points */}
              {predictions.map((val, i) => (
                <circle
                  key={i}
                  cx={i * 40}
                  cy={200 - val * 200}
                  r="3"
                  fill="currentColor"
                  className="text-primary"
                />
              ))}
            </svg>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Model output prediction for the next value in the sequence
          </p>
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold mb-3">Simple RNN</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Updates hidden state based on current input and previous state</li>
              <li>• Formula: h_t = tanh(W_x * x_t + W_h * h_{t-1})</li>
              <li>• Faster to compute but suffers from vanishing gradients</li>
              <li>• Good for short-term dependencies</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold mb-3">LSTM Cell</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Uses three gates: Forget, Input, Output</li>
              <li>• Maintains a separate cell state for long-term memory</li>
              <li>• Can learn long-term dependencies effectively</li>
              <li>• Standard choice for sequence modeling tasks</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
