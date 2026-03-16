'use client';

import { useRef, useState } from 'react';
import { Upload, Loader } from 'lucide-react';

interface Prediction {
  label: string;
  confidence: number;
}

interface ImagePredictionPanelProps {
  onImageLoad?: (canvas: HTMLCanvasElement) => void;
  predictions?: Prediction[];
  isLoading?: boolean;
}

export function ImagePredictionPanel({
  onImageLoad,
  predictions = [],
  isLoading = false,
}: ImagePredictionPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Resize to 28x28 for CNN
        canvas.width = 28;
        canvas.height = 28;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, 28, 28);
        onImageLoad?.(canvas);
      };
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-bold text-lg mb-4">Image Upload & Prediction</h3>

        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium mb-2">Drag and drop your image here</p>
          <p className="text-xs text-muted-foreground mb-4">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
        </div>

        {/* Image Preview */}
        <div className="mt-6">
          <p className="text-sm font-medium text-foreground mb-3">Preview (28×28)</p>
          <div className="bg-background rounded-lg p-4">
            <canvas
              ref={canvasRef}
              className="w-full max-w-xs mx-auto bg-black rounded"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>

        {/* Predictions */}
        {predictions.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-3">Predictions</p>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2">
                {predictions.map((pred, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{pred.label}</span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${pred.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono font-bold min-w-12 text-right">
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Upload an image to see predictions. Images are automatically resized to 28×28 pixels
            for the CNN model.
          </p>
        </div>
      </div>
    </div>
  );
}
