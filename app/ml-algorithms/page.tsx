'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { MLCanvas } from '@/components/ml-canvas';
import {
  generateRegressionData,
  initializeRegressionLine,
  gradientDescentStep,
  Point,
  generateClusterData,
  initializeCentroids,
  kMeansStep,
} from '@/lib/ml-algorithms';
import { Play, Pause, RotateCcw } from 'lucide-react';

type AlgorithmTab = 'gradient-descent' | 'kmeans' | 'decision-tree';

export default function MLAlgorithmsPage() {
  const [activeTab, setActiveTab] = useState<AlgorithmTab>('gradient-descent');

  // Gradient Descent State
  const [regressionData, setRegressionData] = useState(() => generateRegressionData());
  const [regressionLine, setRegressionLine] = useState(() => initializeRegressionLine());
  const [isTrainingGD, setIsTrainingGD] = useState(false);
  const [gdEpoch, setGdEpoch] = useState(0);
  const [gdLearningRate, setGdLearningRate] = useState(0.01);
  const [gdSpeed, setGdSpeed] = useState(50);

  // K-Means State
  const [clusterData, setClusterData] = useState(() => generateClusterData(3, 30));
  const [centroids, setCentroids] = useState(() =>
    initializeCentroids(3, { minX: -15, maxX: 15, minY: -15, maxY: 15 })
  );
  const [isTrainingKM, setIsTrainingKM] = useState(false);
  const [kmEpoch, setKmEpoch] = useState(0);
  const [kmClusters, setKmClusters] = useState(3);
  const [kmSpeed, setKmSpeed] = useState(50);

  // Gradient Descent Training Loop
  useEffect(() => {
    if (!isTrainingGD) return;

    const interval = setInterval(() => {
      setGdEpoch((prev) => prev + 1);
      setRegressionLine((prev) =>
        gradientDescentStep(prev, regressionData, gdLearningRate)
      );
    }, 100 - gdSpeed);

    return () => clearInterval(interval);
  }, [isTrainingGD, regressionData, gdLearningRate, gdSpeed]);

  // K-Means Training Loop
  useEffect(() => {
    if (!isTrainingKM) return;

    const interval = setInterval(() => {
      setKmEpoch((prev) => prev + 1);
      const result = kMeansStep(clusterData, centroids);
      setClusterData(result.points);
      setCentroids(result.centroids);
    }, 100 - kmSpeed);

    return () => clearInterval(interval);
  }, [isTrainingKM, clusterData, centroids, kmSpeed]);

  const handleResetGD = () => {
    setRegressionLine(initializeRegressionLine());
    setGdEpoch(0);
    setIsTrainingGD(false);
  };

  const handleResetKM = () => {
    setClusterData(generateClusterData(kmClusters, 30));
    setCentroids(initializeCentroids(kmClusters, { minX: -15, maxX: 15, minY: -15, maxY: 15 }));
    setKmEpoch(0);
    setIsTrainingKM(false);
  };

  const handleChangeClusters = (k: number) => {
    setKmClusters(k);
    setClusterData(generateClusterData(k, 30));
    setCentroids(initializeCentroids(k, { minX: -15, maxX: 15, minY: -15, maxY: 15 }));
    setKmEpoch(0);
    setIsTrainingKM(false);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Machine Learning Algorithms</h1>
            <p className="text-muted-foreground max-w-2xl">
              Visualize fundamental ML algorithms in action. See how gradient descent
              optimizes functions, how k-means clusters data, and how decision trees make
              predictions.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {[
              { id: 'gradient-descent', label: 'Gradient Descent' },
              { id: 'kmeans', label: 'K-Means Clustering' },
              { id: 'decision-tree', label: 'Decision Trees' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AlgorithmTab)}
                className={`px-4 py-3 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gradient Descent Tab */}
          {activeTab === 'gradient-descent' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Linear Regression Optimization</h2>
                  <MLCanvas
                    points={regressionData}
                    type="gradient-descent"
                    regressionLine={regressionLine}
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Training Progress</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Iteration</p>
                      <p className="text-3xl font-bold text-primary">{gdEpoch}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Loss</p>
                      <p className="text-3xl font-bold text-accent">
                        {regressionLine.loss.toFixed(3)}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">Parameters</p>
                      <div className="text-xs space-y-1 font-mono">
                        <p>Slope: {regressionLine.slope.toFixed(3)}</p>
                        <p>Intercept: {regressionLine.intercept.toFixed(3)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-border">
                      <button
                        onClick={() => setIsTrainingGD(!isTrainingGD)}
                        className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        {isTrainingGD ? (
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
                        onClick={handleResetGD}
                        className="flex-1 px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Configuration</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Learning Rate: {gdLearningRate.toFixed(4)}
                      </label>
                      <input
                        type="range"
                        min="0.0001"
                        max="0.1"
                        step="0.0001"
                        value={gdLearningRate}
                        onChange={(e) => setGdLearningRate(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Speed: {gdSpeed}%
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={gdSpeed}
                        onChange={(e) => setGdSpeed(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* K-Means Tab */}
          {activeTab === 'kmeans' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">K-Means Clustering</h2>
                  <MLCanvas
                    points={clusterData}
                    type="kmeans"
                    centroids={centroids}
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Clustering Progress</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Iteration</p>
                      <p className="text-3xl font-bold text-primary">{kmEpoch}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Clusters</p>
                      <p className="text-3xl font-bold text-accent">{kmClusters}</p>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-border">
                      <button
                        onClick={() => setIsTrainingKM(!isTrainingKM)}
                        className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        {isTrainingKM ? (
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
                        onClick={handleResetKM}
                        className="flex-1 px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Configuration</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Number of Clusters: {kmClusters}
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        value={kmClusters}
                        onChange={(e) => handleChangeClusters(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Speed: {kmSpeed}%
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={kmSpeed}
                        onChange={(e) => setKmSpeed(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Decision Trees Tab */}
          {activeTab === 'decision-tree' && (
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Decision Trees</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Interactive decision tree visualization coming soon! This module will show how
                decision trees recursively split data to make predictions, visualizing the
                splitting criteria and decision boundaries.
              </p>
              <div className="inline-block px-6 py-3 rounded-lg bg-secondary text-foreground">
                Under Development
              </div>
            </div>
          )}

          {/* Algorithm Explanations */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Gradient Descent',
                description:
                  'Iteratively adjusts model parameters in the direction of steepest descent to minimize a loss function.',
              },
              {
                title: 'K-Means Clustering',
                description:
                  'Partitions data into k clusters by iteratively assigning points to nearest centroids and updating centroid positions.',
              },
              {
                title: 'Decision Trees',
                description:
                  'Recursively splits data using features that maximize information gain, creating a tree of decision rules.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
