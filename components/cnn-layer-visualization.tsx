'use client';

import { useEffect, useRef, useState } from 'react';
import { drawImageData, type ImageData2D } from '@/lib/image-processing';

interface CNNLayerVisualizationProps {
  inputImage: ImageData2D;
  layerOutputs: ImageData2D[];
  layerNames: string[];
  selectedLayerIndex: number;
  onSelectLayer: (index: number) => void;
}

export function CNNLayerVisualization({
  inputImage,
  layerOutputs,
  layerNames,
  selectedLayerIndex,
  onSelectLayer,
}: CNNLayerVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stats, setStats] = useState({ min: 0, max: 0, mean: 0, std: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const output = layerOutputs[selectedLayerIndex];
    if (!output) return;

    drawImageData(canvasRef.current, output, selectedLayerIndex % 2 === 0 ? 'grayscale' : 'heat');

    // Calculate statistics
    const flat = output.data.flat();
    const min = Math.min(...flat);
    const max = Math.max(...flat);
    const mean = flat.reduce((a, b) => a + b, 0) / flat.length;
    const variance = flat.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / flat.length;
    const std = Math.sqrt(variance);

    setStats({ min, max, mean, std });
  }, [selectedLayerIndex, layerOutputs]);

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Layer Visualization</h3>

        {/* Canvas */}
        <div className="bg-background rounded-lg overflow-hidden mb-4">
          <canvas
            ref={canvasRef}
            className="w-full h-auto"
            style={{ maxHeight: '400px' }}
          />
        </div>

        {/* Layer Selection */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Select Layer
          </label>
          <div className="flex flex-wrap gap-2">
            {layerNames.map((name, idx) => (
              <button
                key={idx}
                onClick={() => onSelectLayer(idx)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                  selectedLayerIndex === idx
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Min</p>
            <p className="font-mono text-sm font-bold">{stats.min.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Max</p>
            <p className="font-mono text-sm font-bold">{stats.max.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Mean</p>
            <p className="font-mono text-sm font-bold">{stats.mean.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Std Dev</p>
            <p className="font-mono text-sm font-bold">{stats.std.toFixed(3)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
