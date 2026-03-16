'use client';

import { useEffect, useRef } from 'react';
import { Point, clusterColors } from '@/lib/ml-algorithms';

interface MLCanvasProps {
  points: Point[];
  type: 'gradient-descent' | 'kmeans' | 'decision-tree';
  regressionLine?: { slope: number; intercept: number };
  centroids?: Point[];
  width?: number;
  height?: number;
}

export function MLCanvas({
  points,
  type,
  regressionLine,
  centroids,
  width = 600,
  height = 400,
}: MLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Set up padding
    const padding = 40;
    const plotWidth = width - padding * 2;
    const plotHeight = height - padding * 2;

    // Draw grid
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * plotWidth;
      const y = padding + (i / 5) * plotHeight;

      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + plotHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + plotWidth, y);
      ctx.stroke();
    }

    // Find data bounds
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    const minX = Math.min(...xs, -10);
    const maxX = Math.max(...xs, 10);
    const minY = Math.min(...ys, -10);
    const maxY = Math.max(...ys, 10);

    const scaleX = plotWidth / (maxX - minX);
    const scaleY = plotHeight / (maxY - minY);

    const toCanvasX = (x: number) => padding + (x - minX) * scaleX;
    const toCanvasY = (y: number) => padding + plotHeight - (y - minY) * scaleY;

    if (type === 'gradient-descent' && regressionLine) {
      // Draw regression line
      const x1 = minX;
      const y1 = regressionLine.slope * x1 + regressionLine.intercept;
      const x2 = maxX;
      const y2 = regressionLine.slope * x2 + regressionLine.intercept;

      ctx.strokeStyle = '#ff6b6b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
      ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
      ctx.stroke();

      // Draw residual lines
      ctx.strokeStyle = 'rgba(255, 107, 107, 0.3)';
      ctx.lineWidth = 1;
      points.forEach((point) => {
        const predicted = regressionLine.slope * point.x + regressionLine.intercept;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(point.x), toCanvasY(point.y));
        ctx.lineTo(toCanvasX(point.x), toCanvasY(predicted));
        ctx.stroke();
      });
    }

    // Draw points
    points.forEach((point, index) => {
      const canvasX = toCanvasX(point.x);
      const canvasY = toCanvasY(point.y);

      let color = '#94a3b8';

      if (type === 'kmeans' && point.cluster !== undefined) {
        color = clusterColors[point.cluster % clusterColors.length];
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 4, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw centroids (for k-means)
    if (type === 'kmeans' && centroids) {
      centroids.forEach((centroid, index) => {
        const canvasX = toCanvasX(centroid.x);
        const canvasY = toCanvasY(centroid.y);

        // Draw star for centroid
        ctx.fillStyle = clusterColors[index % clusterColors.length];
        ctx.globalAlpha = 0.8;

        // Draw larger circle
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;

        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Draw cross
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(canvasX - 5, canvasY);
        ctx.lineTo(canvasX + 5, canvasY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvasX, canvasY - 5);
        ctx.lineTo(canvasX, canvasY + 5);
        ctx.stroke();
      });
    }

    // Draw axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding + plotHeight);
    ctx.lineTo(padding + plotWidth, padding + plotHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + plotHeight);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';

    ctx.fillText('X', padding + plotWidth + 10, padding + plotHeight + 10);
    ctx.textAlign = 'right';
    ctx.fillText('Y', padding - 10, padding - 10);
  }, [points, type, regressionLine, centroids, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full border border-border rounded-lg bg-background"
    />
  );
}
