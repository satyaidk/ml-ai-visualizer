'use client';

import React, { useRef, useEffect, useState } from 'react';

interface RAGCanvasProps {
  query: string;
  retrievedDocs: Array<{ id: string; relevance: number }>;
  step: number;
}

export const RAGCanvas: React.FC<RAGCanvasProps> = ({ query, retrievedDocs, step }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = 'rgb(15, 23, 42)';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Draw based on step
    if (step === 0) drawQuery(ctx);
    else if (step === 1) drawEmbedding(ctx);
    else if (step === 2) drawRetrieval(ctx);
    else if (step === 3) drawGeneration(ctx);
  }, [step, dimensions, retrievedDocs]);

  const drawQuery = (ctx: CanvasRenderingContext2D) => {
    const x = 400;
    const y = 200;

    // Query box
    ctx.fillStyle = 'rgba(88, 155, 255, 0.2)';
    ctx.strokeStyle = 'rgb(88, 155, 255)';
    ctx.lineWidth = 2;
    ctx.roundRect(x - 100, y - 50, 200, 100, 8);
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = 'rgb(248, 250, 252)';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('User Query', x, y - 10);
    ctx.font = '12px monospace';
    ctx.fillStyle = 'rgb(200, 200, 255)';
    ctx.fillText('"' + query.substring(0, 20) + (query.length > 20 ? '..."' : '"'), x, y + 15);
  };

  const drawEmbedding = (ctx: CanvasRenderingContext2D) => {
    // Step 1: Query to embedding
    const sx = 100, sy = 200;
    const ex = 700, ey = 200;

    // Query
    ctx.fillStyle = 'rgba(88, 155, 255, 0.3)';
    ctx.strokeStyle = 'rgb(88, 155, 255)';
    ctx.lineWidth = 2;
    ctx.roundRect(sx - 60, sy - 40, 120, 80, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgb(248, 250, 252)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Query', sx, sy);

    // Embedding Model
    ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.strokeStyle = 'rgb(168, 85, 247)';
    ctx.lineWidth = 2;
    ctx.roundRect(400 - 80, sy - 40, 160, 80, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgb(248, 250, 252)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Embedding', 400, sy - 10);
    ctx.font = '10px monospace';
    ctx.fillText('Model', 400, sy + 10);

    // Embedding Vector
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.strokeStyle = 'rgb(34, 197, 94)';
    ctx.lineWidth = 2;
    ctx.roundRect(ex - 80, ey - 40, 160, 80, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgb(248, 250, 252)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Vector', ex, ey - 10);
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgb(134, 239, 172)';
    ctx.fillText('[0.2, 0.5, ...]', ex, ey + 10);

    // Arrows
    ctx.strokeStyle = 'rgb(100, 150, 255)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx + 60, sy);
    ctx.lineTo(320, sy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(480, sy);
    ctx.lineTo(ex - 80, ey);
    ctx.stroke();
  };

  const drawRetrieval = (ctx: CanvasRenderingContext2D) => {
    // Vector search
    ctx.fillStyle = 'rgba(88, 155, 255, 0.15)';
    ctx.strokeStyle = 'rgb(88, 155, 255)';
    ctx.lineWidth = 2;
    ctx.roundRect(50, 80, 700, 260, 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgb(248, 250, 252)';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Vector Search in Knowledge Base', 70, 110);

    // Draw documents
    const docY = 150;
    const docSpacing = 230;
    retrievedDocs.slice(0, 3).forEach((doc, i) => {
      const x = 120 + i * docSpacing;
      const alpha = doc.relevance;

      ctx.fillStyle = `rgba(34, 197, 94, ${0.1 + alpha * 0.2})`;
      ctx.strokeStyle = `rgba(34, 197, 94, ${0.3 + alpha * 0.5})`;
      ctx.lineWidth = 2;
      ctx.roundRect(x - 50, docY, 100, 60, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgb(248, 250, 252)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(doc.id, x, docY + 20);

      ctx.fillStyle = `rgba(100, 255, 150, ${0.5 + alpha * 0.5})`;
      ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
      ctx.fillText(`${(doc.relevance * 100).toFixed(0)}%`, x, docY + 40);
    });

    // Arrow pointing to selected
    ctx.strokeStyle = 'rgb(34, 197, 94)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(120, docY - 20);
    ctx.lineTo(120, docY);
    ctx.stroke();
  };

  const drawGeneration = (ctx: CanvasRenderingContext2D) => {
    // Generation step
    const startX = 100, startY = 100;
    const width = 600, height = 240;

    // Title
    ctx.fillStyle = 'rgb(248, 250, 252)';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Generate Response with Context', startX, startY - 20);

    // Retrieved context box
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.strokeStyle = 'rgb(99, 102, 241)';
    ctx.lineWidth = 2;
    ctx.roundRect(startX, startY, width / 2 - 20, 100, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgb(248, 250, 252)';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Retrieved Context', startX + 12, startY + 25);

    ctx.fillStyle = 'rgb(150, 160, 255)';
    ctx.font = '10px monospace';
    ctx.fillText('Document chunks with', startX + 12, startY + 45);
    ctx.fillText('similarity scores', startX + 12, startY + 60);
    ctx.fillText('combined for generation', startX + 12, startY + 75);

    // Generator box
    ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
    ctx.strokeStyle = 'rgb(168, 85, 247)';
    ctx.lineWidth = 2;
    ctx.roundRect(startX + width / 2 + 10, startY, width / 2 - 30, 100, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgb(248, 250, 252)';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('LLM Generator', startX + width / 2 + 22, startY + 25);

    ctx.fillStyle = 'rgb(220, 150, 255)';
    ctx.font = '10px monospace';
    ctx.fillText('Generates answer using', startX + width / 2 + 22, startY + 45);
    ctx.fillText('retrieved context +', startX + width / 2 + 22, startY + 60);
    ctx.fillText('prompt template', startX + width / 2 + 22, startY + 75);

    // Arrow
    ctx.strokeStyle = 'rgb(100, 150, 255)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX + width / 2 - 20, startY + 50);
    ctx.lineTo(startX + width / 2 + 10, startY + 50);
    ctx.stroke();

    // Output box
    ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
    ctx.strokeStyle = 'rgb(34, 197, 94)';
    ctx.lineWidth = 2;
    ctx.roundRect(startX, startY + 120, width, 100, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgb(248, 250, 252)';
    ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Final Response', startX + 12, startY + 145);

    ctx.fillStyle = 'rgb(134, 239, 172)';
    ctx.font = '10px monospace';
    ctx.fillText('Factual answer grounded in', startX + 12, startY + 165);
    ctx.fillText('retrieved documents with sources', startX + 12, startY + 180);
    ctx.fillText('cited for verification', startX + 12, startY + 195);
  };

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className="w-full border border-border rounded-lg bg-card"
      style={{ maxHeight: '400px' }}
    />
  );
};
