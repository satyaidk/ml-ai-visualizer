'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { MLCanvas } from '@/components/ml-canvas';
import {
  generateBinaryClassificationData,
  trainSVM,
  predictSVM,
  trainRandomForest,
  predictRandomForest,
  trainGMM,
  predictGMM,
  trainNaiveBayes,
  predictNaiveBayes,
  generateDecisionBoundary,
} from '@/lib/ml-algorithms-advanced';
import { Point } from '@/lib/ml-algorithms';
import { Play, Pause, RotateCcw } from 'lucide-react';

type AlgorithmType = 'svm' | 'random-forest' | 'gmm' | 'naive-bayes';

export default function AdvancedAlgorithmsPage() {
  const [activeAlgorithm, setActiveAlgorithm] = useState<AlgorithmType>('svm');

  // SVM State
  const [svmData, setSvmData] = useState(() => generateBinaryClassificationData());
  const [svmKernel, setSvmKernel] = useState<'linear' | 'rbf' | 'polynomial'>('rbf');
  const [svmKernelParam, setSvmKernelParam] = useState(0.1);
  const [svmAccuracy, setSvmAccuracy] = useState(0);

  // Random Forest State
  const [rfData, setRfData] = useState(() => generateBinaryClassificationData());
  const [rfNumTrees, setRfNumTrees] = useState(5);
  const [rfAccuracy, setRfAccuracy] = useState(0);

  // GMM State
  const [gmmData, setGmmData] = useState(() => generateBinaryClassificationData());
  const [gmmNumComponents, setGmmNumComponents] = useState(3);
  const [gmmAccuracy, setGmmAccuracy] = useState(0);

  // Naive Bayes State
  const [nbData, setNbData] = useState(() => generateBinaryClassificationData());
  const [nbAccuracy, setNbAccuracy] = useState(0);

  // Train SVM and calculate accuracy
  useEffect(() => {
    const svmModel = trainSVM(svmData, svmKernel, svmKernelParam);
    let correct = 0;

    svmData.points.forEach((point, i) => {
      const prediction = predictSVM(svmModel, point, svmData.points, svmData.labels);
      if (prediction === svmData.labels[i]) {
        correct++;
      }
    });

    setSvmAccuracy((correct / svmData.points.length) * 100);
  }, [svmData, svmKernel, svmKernelParam]);

  // Train Random Forest and calculate accuracy
  useEffect(() => {
    const rfModel = trainRandomForest(rfData, rfNumTrees);
    let correct = 0;

    rfData.points.forEach((point, i) => {
      const prediction = predictRandomForest(rfModel, point);
      if (prediction === rfData.labels[i]) {
        correct++;
      }
    });

    setRfAccuracy((correct / rfData.points.length) * 100);
  }, [rfData, rfNumTrees]);

  // Train GMM and calculate accuracy
  useEffect(() => {
    const gmmModel = trainGMM(gmmData, gmmNumComponents);
    let correct = 0;

    gmmData.points.forEach((point, i) => {
      const prediction = predictGMM(gmmModel, point);
      if (prediction.component === gmmData.labels[i]) {
        correct++;
      }
    });

    setGmmAccuracy((correct / gmmData.points.length) * 100);
  }, [gmmData, gmmNumComponents]);

  // Train Naive Bayes and calculate accuracy
  useEffect(() => {
    const nbModel = trainNaiveBayes(nbData);
    let correct = 0;

    nbData.points.forEach((point, i) => {
      const prediction = predictNaiveBayes(nbModel, point);
      if (prediction === nbData.labels[i]) {
        correct++;
      }
    });

    setNbAccuracy((correct / nbData.points.length) * 100);
  }, [nbData]);

  // Convert classification data to visualization points
  const toVisualizationPoints = (points: Point[], labels: number[]) => {
    return points.map((p, i) => ({
      ...p,
      cluster: labels[i],
    }));
  };

  const handleNewData = (setter: (data: any) => void) => {
    setter(generateBinaryClassificationData());
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Advanced ML Algorithms</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore advanced machine learning algorithms including Support Vector Machines,
              Random Forests, Gaussian Mixture Models, and Naive Bayes classifiers with
              interactive visualizations.
            </p>
          </div>

          {/* Algorithm Selector */}
          <div className="flex gap-2 mb-8 border-b border-border flex-wrap">
            {[
              { id: 'svm', label: 'Support Vector Machine' },
              { id: 'random-forest', label: 'Random Forest' },
              { id: 'gmm', label: 'Gaussian Mixture Model' },
              { id: 'naive-bayes', label: 'Naive Bayes' },
            ].map((algo) => (
              <button
                key={algo.id}
                onClick={() => setActiveAlgorithm(algo.id as AlgorithmType)}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeAlgorithm === algo.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {algo.label}
              </button>
            ))}
          </div>

          {/* SVM */}
          {activeAlgorithm === 'svm' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">SVM Classification</h2>
                  <MLCanvas
                    points={toVisualizationPoints(svmData.points, svmData.labels)}
                    type="kmeans"
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
                      <p className="text-3xl font-bold text-primary">{svmAccuracy.toFixed(1)}%</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => handleNewData(setSvmData)}
                        className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> New Data
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Kernel Type
                      </label>
                      <select
                        value={svmKernel}
                        onChange={(e) => setSvmKernel(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-secondary text-foreground border border-border"
                      >
                        <option value="linear">Linear</option>
                        <option value="rbf">RBF (Radial Basis Function)</option>
                        <option value="polynomial">Polynomial</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Kernel Parameter: {svmKernelParam.toFixed(3)}
                      </label>
                      <input
                        type="range"
                        min="0.01"
                        max="1"
                        step="0.01"
                        value={svmKernelParam}
                        onChange={(e) => setSvmKernelParam(parseFloat(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Random Forest */}
          {activeAlgorithm === 'random-forest' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Random Forest Classification</h2>
                  <MLCanvas
                    points={toVisualizationPoints(rfData.points, rfData.labels)}
                    type="kmeans"
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
                      <p className="text-3xl font-bold text-primary">{rfAccuracy.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Trees</p>
                      <p className="text-2xl font-bold text-accent">{rfNumTrees}</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => handleNewData(setRfData)}
                        className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> New Data
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Number of Trees: {rfNumTrees}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={rfNumTrees}
                        onChange={(e) => setRfNumTrees(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GMM */}
          {activeAlgorithm === 'gmm' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Gaussian Mixture Models</h2>
                  <MLCanvas
                    points={toVisualizationPoints(gmmData.points, gmmData.labels)}
                    type="kmeans"
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
                      <p className="text-3xl font-bold text-primary">{gmmAccuracy.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Components</p>
                      <p className="text-2xl font-bold text-accent">{gmmNumComponents}</p>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => handleNewData(setGmmData)}
                        className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> New Data
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Number of Components: {gmmNumComponents}
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="6"
                        value={gmmNumComponents}
                        onChange={(e) => setGmmNumComponents(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Naive Bayes */}
          {activeAlgorithm === 'naive-bayes' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="font-bold text-lg mb-4">Naive Bayes Classification</h2>
                  <MLCanvas
                    points={toVisualizationPoints(nbData.points, nbData.labels)}
                    type="kmeans"
                    width={600}
                    height={400}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">Performance</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
                      <p className="text-3xl font-bold text-primary">{nbAccuracy.toFixed(1)}%</p>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => handleNewData(setNbData)}
                        className="w-full px-3 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" /> New Data
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-lg mb-4">About</h3>
                  <p className="text-sm text-muted-foreground">
                    Naive Bayes assumes feature independence and calculates posterior probabilities
                    using Bayes' theorem. Fast and effective for classification tasks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Algorithm Descriptions */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'SVM',
                description:
                  'Support Vector Machines find optimal decision boundaries by maximizing margin between classes.',
              },
              {
                title: 'Random Forest',
                description:
                  'Ensemble method combining multiple decision trees through bootstrap aggregation for robust predictions.',
              },
              {
                title: 'GMM',
                description:
                  'Gaussian Mixture Models use probabilistic clustering to model data as mixture of Gaussian distributions.',
              },
              {
                title: 'Naive Bayes',
                description:
                  'Probabilistic classifier based on Bayes theorem with assumption of feature independence.',
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
