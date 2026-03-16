'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { CNNLayerVisualization } from '@/components/cnn-layer-visualization';
import { CNNFilterViewer } from '@/components/cnn-filter-viewer';
import { ImagePredictionPanel } from '@/components/image-prediction-panel';
import {
  createMNISTModel,
  forwardPass,
  predictDigit,
  createEdgeDetectionFilters,
  createConvLayer,
} from '@/lib/cnn-models';
import {
  generateSimpleDigit,
  resizeImage,
  normalizeImage,
  type ImageData2D,
} from '@/lib/image-processing';
import { RotateCcw } from 'lucide-react';

interface Prediction {
  label: string;
  confidence: number;
}

export default function CNNVisualizationPage() {
  const [model] = useState(() => createMNISTModel());
  const [inputImage, setInputImage] = useState<ImageData2D>(() => {
    return normalizeImage(generateSimpleDigit(28, 28));
  });
  const [layerOutputs, setLayerOutputs] = useState<ImageData2D[]>([]);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showArchitecture, setShowArchitecture] = useState(true);

  // Get layer names
  const layerNames = model.layers.map((layer) => layer.name);

  // Run forward pass when input changes
  useEffect(() => {
    const outputs = forwardPass(model, inputImage);
    setLayerOutputs(outputs);

    const digitPredictions = predictDigit(model, inputImage);
    const predictionsArray: Prediction[] = digitPredictions.predictions.map((digit, idx) => ({
      label: `Digit ${digit}`,
      confidence: digitPredictions.confidence[idx],
    }));
    setPredictions(predictionsArray);
  }, [inputImage, model]);

  const handleImageUpload = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale normalized
    const grayscale: number[][] = [];
    for (let i = 0; i < 28; i++) {
      const row: number[] = [];
      for (let j = 0; j < 28; j++) {
        const index = (i * 28 + j) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const gray = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
        row.push(gray);
      }
      grayscale.push(row);
    }

    setInputImage({
      data: grayscale,
      width: 28,
      height: 28,
      channels: 1,
    });
  };

  const handleGenerateNew = () => {
    setInputImage(normalizeImage(generateSimpleDigit(28, 28)));
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">CNN Visualization</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore how Convolutional Neural Networks process images. Upload an image or use the
              generated sample to see how each layer transforms the data and what filters learn.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Image Input and Predictions */}
            <div className="lg:col-span-1">
              <ImagePredictionPanel
                onImageLoad={handleImageUpload}
                predictions={predictions}
                isLoading={false}
              />

              <div className="mt-6">
                <button
                  onClick={handleGenerateNew}
                  className="w-full px-4 py-3 rounded-lg bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Generate New Sample
                </button>
              </div>
            </div>

            {/* Right Column - Layer Visualization */}
            <div className="lg:col-span-2">
              <CNNLayerVisualization
                inputImage={inputImage}
                layerOutputs={layerOutputs}
                layerNames={layerNames}
                selectedLayerIndex={selectedLayerIndex}
                onSelectLayer={setSelectedLayerIndex}
              />
            </div>
          </div>

          {/* Filter Viewer */}
          <div className="mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Learned Filters</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {model.layers
                  .filter((layer) => 'filters' in layer)
                  .map((layer, idx) => (
                    <CNNFilterViewer
                      key={idx}
                      filters={(layer as any).filters}
                      layerName={layer.name}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Architecture Explanation */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">Network Architecture</h3>
              <button
                onClick={() => setShowArchitecture(!showArchitecture)}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {showArchitecture ? 'Hide' : 'Show'}
              </button>
            </div>

            {showArchitecture && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {model.layers.map((layer, idx) => (
                    <div key={idx} className="bg-background rounded-lg p-4 border border-border/50">
                      <p className="text-sm font-mono text-primary font-bold">{layer.name}</p>
                      {'filters' in layer && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Filters: {(layer as any).filters.length}
                        </p>
                      )}
                      {(layer as any).poolSize && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Pool Size: {(layer as any).poolSize}×{(layer as any).poolSize}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Type: {(layer as any).type || 'Conv'}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    This CNN consists of 2 convolutional blocks, each followed by ReLU activation and
                    max pooling. The network learns to detect features like edges, corners, and textures
                    in the early layers, and combines them into higher-level features in deeper layers.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Learning Resources */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Convolutional Layers',
                description:
                  'Apply learned filters to detect local features in images. Each filter slides across the input to produce feature maps.',
              },
              {
                title: 'Activation Functions',
                description:
                  'ReLU (Rectified Linear Unit) introduces non-linearity, allowing the network to learn complex patterns.',
              },
              {
                title: 'Pooling Layers',
                description:
                  'Reduce spatial dimensions by taking the maximum value in each region, helping the network become translation-invariant.',
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
