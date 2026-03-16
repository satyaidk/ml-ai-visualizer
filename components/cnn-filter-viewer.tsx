'use client';

import { useEffect, useRef, useState } from 'react';
import { drawImageData, visualizeFilter } from '@/lib/image-processing';

interface CNNFilterViewerProps {
  filters: number[][][];
  layerName: string;
}

export function CNNFilterViewer({ filters, layerName }: CNNFilterViewerProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(0);

  useEffect(() => {
    filters.forEach((filter, idx) => {
      const canvas = canvasRefs.current[idx];
      if (!canvas) return;

      const filterImage = visualizeFilter(filter);
      drawImageData(canvas, filterImage, 'heat');
    });
  }, [filters]);

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Learned Filters - {layerName}</h3>

        {/* Selected Filter Display */}
        <div className="bg-background rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-3">Filter {selectedFilter + 1}</p>
          <canvas
            ref={(el) => {
              if (el) canvasRefs.current[selectedFilter] = el;
            }}
            className="w-full max-w-xs mx-auto bg-black rounded"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Filter Grid */}
        <div>
          <label className="text-sm font-medium text-foreground mb-3 block">
            Select Filter
          </label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {filters.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedFilter(idx)}
                className={`aspect-square rounded-lg border-2 overflow-hidden transition-colors ${
                  selectedFilter === idx
                    ? 'border-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <canvas
                  ref={(el) => {
                    if (el) canvasRefs.current[idx] = el;
                  }}
                  className="w-full h-full"
                  style={{ imageRendering: 'pixelated' }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Filter Statistics */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-3">Filter Statistics</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kernel Size:</span>
              <span className="font-mono">{filters[selectedFilter]?.length}×{filters[selectedFilter]?.[0]?.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Filters:</span>
              <span className="font-mono">{filters.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Parameters:</span>
              <span className="font-mono">
                {(filters[selectedFilter]?.length ?? 0) * (filters[selectedFilter]?.[0]?.length ?? 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
