'use client';

import { useEffect, useRef } from 'react';
import { TransformerState } from '@/lib/transformers';

interface TransformerCanvasProps {
  state: TransformerState;
  width?: number;
  height?: number;
  visualizationType?: 'attention' | 'embedding' | 'architecture';
}

export function TransformerCanvas({
  state,
  width = 800,
  height = 500,
  visualizationType = 'attention',
}: TransformerCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    if (visualizationType === 'attention') {
      drawAttentionHeatmap(ctx, state, width, height);
    } else if (visualizationType === 'embedding') {
      drawEmbeddingVisualization(ctx, state, width, height);
    } else if (visualizationType === 'architecture') {
      drawArchitecture(ctx, state, width, height);
    }
  }, [state, width, height, visualizationType]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full border border-border rounded-lg bg-background"
    />
  );
}

function drawAttentionHeatmap(
  ctx: CanvasRenderingContext2D,
  state: TransformerState,
  width: number,
  height: number
) {
  const numTokens = state.tokens.length;
  const cellSize = Math.min((width - 80) / numTokens, (height - 80) / numTokens);
  const startX = 40;
  const startY = 40;

  // Draw heatmap grid
  state.attentionScores.forEach((scores, i) => {
    scores.forEach((score, j) => {
      const x = startX + j * cellSize;
      const y = startY + i * cellSize;

      // Normalize score to color
      const normalized = (score + 1) / 2; // Convert from [-1, 1] to [0, 1]
      const hue = (1 - normalized) * 280; // Blue to purple gradient
      const saturation = 70 + normalized * 30;
      const lightness = 50 - normalized * 30;

      ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.fillRect(x, y, cellSize, cellSize);

      // Draw border
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellSize, cellSize);
    });
  });

  // Draw token labels on axes
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 12px monospace';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  state.tokens.forEach((token, i) => {
    const x = startX + i * cellSize + cellSize / 2;
    const y = startY - 5;

    // Top labels
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-Math.PI / 4);
    ctx.fillText(token.value, 0, 0);
    ctx.restore();

    // Left labels
    ctx.textAlign = 'right';
    ctx.fillText(token.value, startX - 5, startY + i * cellSize + cellSize / 2);
  });

  // Draw legend
  const legendX = startX + numTokens * cellSize + 20;
  const legendY = startY;
  const legendHeight = 200;

  for (let i = 0; i < 100; i++) {
    const normalized = i / 100;
    const hue = (1 - normalized) * 280;
    const saturation = 70 + normalized * 30;
    const lightness = 50 - normalized * 30;

    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.fillRect(legendX, legendY + (i / 100) * legendHeight, 20, (legendHeight / 100) * 1.2);
  }

  // Legend labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('Low', legendX + 25, legendY);
  ctx.fillText('High', legendX + 25, legendY + legendHeight);
}

function drawEmbeddingVisualization(
  ctx: CanvasRenderingContext2D,
  state: TransformerState,
  width: number,
  height: number
) {
  const padding = 40;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  // Draw grid background
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

  // Project embeddings to 2D using simple PCA approximation
  const embeddings = state.embedding;
  const dim = embeddings[0].length;

  // Use first two dimensions as proxy for visualization
  const minE0 = Math.min(...embeddings.map((e) => e[0]));
  const maxE0 = Math.max(...embeddings.map((e) => e[0]));
  const minE1 = Math.min(...embeddings.map((e) => e[1]));
  const maxE1 = Math.max(...embeddings.map((e) => e[1]));

  const rangeE0 = maxE0 - minE0 || 1;
  const rangeE1 = maxE1 - minE1 || 1;

  // Draw embeddings as points
  state.tokens.forEach((token, idx) => {
    const emb = embeddings[idx];
    const x = padding + ((emb[0] - minE0) / rangeE0) * plotWidth;
    const y = padding + plotHeight - ((emb[1] - minE1) / rangeE1) * plotHeight;

    // Draw point with color based on position in sequence
    const hue = (idx / state.tokens.length) * 360;
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw glow
    ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.stroke();

    // Draw label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(token.value, x, y - 12);
  });

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

  // Axis labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Embedding Dimension 0', padding + plotWidth / 2, padding + plotHeight + 30);
}

function drawArchitecture(
  ctx: CanvasRenderingContext2D,
  state: TransformerState,
  width: number,
  height: number
) {
  const blockWidth = 140;
  const blockHeight = 60;
  const startX = 30;
  const startY = 40;
  const spacing = 30;

  const blocks = [
    { label: 'Input\nTokens', x: startX },
    { label: 'Embedding +\nPos Encoding', x: startX + blockWidth + spacing },
    { label: 'Multi-Head\nAttention', x: startX + (blockWidth + spacing) * 2 },
    { label: 'Feed\nForward', x: startX + (blockWidth + spacing) * 3 },
    { label: 'Output', x: startX + (blockWidth + spacing) * 4 },
  ];

  // Draw blocks
  blocks.forEach((block) => {
    if (block.x + blockWidth < width) {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#65a3ff';
      ctx.lineWidth = 2;
      ctx.fillRect(block.x, startY, blockWidth, blockHeight);
      ctx.strokeRect(block.x, startY, blockWidth, blockHeight);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = block.label.split('\n');
      const lineHeight = 14;
      const totalHeight = (lines.length - 1) * lineHeight;
      const startTextY = startY + blockHeight / 2 - totalHeight / 2;

      lines.forEach((line, i) => {
        ctx.fillText(line, block.x + blockWidth / 2, startTextY + i * lineHeight);
      });
    }
  });

  // Draw arrows between blocks
  ctx.strokeStyle = '#65a3ff';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  for (let i = 0; i < blocks.length - 1; i++) {
    const fromX = blocks[i].x + blockWidth;
    const toX = blocks[i + 1].x;
    const y = startY + blockHeight / 2;

    ctx.beginPath();
    ctx.moveTo(fromX, y);
    ctx.lineTo(toX, y);
    ctx.stroke();

    // Draw arrowhead
    ctx.setLineDash([]);
    const headlen = 10;
    const angle = 0;

    ctx.beginPath();
    ctx.moveTo(toX, y);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), y - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), y - headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = '#65a3ff';
    ctx.fill();
  }

  // Draw token flow indicators
  ctx.fillStyle = 'rgba(101, 163, 255, 0.3)';
  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${state.tokens.length} tokens flowing through architecture`, width / 2, height - 20);
}
