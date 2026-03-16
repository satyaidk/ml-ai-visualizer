'use client';

import { useEffect, useRef } from 'react';
import { Neuron, Connection } from '@/lib/neural-network';

interface NeuralNetworkCanvasProps {
  neurons: Neuron[];
  connections: Connection[];
  width?: number;
  height?: number;
  animationProgress?: number;
}

export function NeuralNetworkCanvas({
  neurons,
  connections,
  width = 800,
  height = 500,
  animationProgress = 0,
}: NeuralNetworkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Group neurons by layer
    const layers: Neuron[][] = [];
    neurons.forEach((neuron) => {
      if (!layers[neuron.layer]) {
        layers[neuron.layer] = [];
      }
      layers[neuron.layer].push(neuron);
    });

    if (layers.length === 0) return;

    // Calculate positions for neurons
    const layerSpacing = width / (layers.length + 1);
    const positions: { [key: string]: { x: number; y: number } } = {};

    layers.forEach((layer, layerIndex) => {
      const x = (layerIndex + 1) * layerSpacing;
      const verticalSpacing = height / (layer.length + 1);

      layer.forEach((neuron, neuronIndex) => {
        const y = (neuronIndex + 1) * verticalSpacing;
        positions[neuron.id] = { x, y };
      });
    });

    // Draw connections first (so they appear behind neurons)
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
    ctx.lineWidth = 1;

    connections.forEach((connection) => {
      const fromPos = positions[connection.from];
      const toPos = positions[connection.to];

      if (fromPos && toPos) {
        // Color connections based on weight
        const weightNormalized = Math.abs(connection.weight) / 2;
        if (connection.weight > 0) {
          ctx.strokeStyle = `rgba(101, 163, 255, ${0.2 + weightNormalized * 0.6})`;
        } else {
          ctx.strokeStyle = `rgba(255, 105, 180, ${0.2 + weightNormalized * 0.6})`;
        }
        ctx.lineWidth = 0.5 + Math.abs(connection.weight) * 2;

        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(toPos.x, toPos.y);
        ctx.stroke();
      }
    });

    // Draw neurons
    neurons.forEach((neuron) => {
      const pos = positions[neuron.id];
      if (!pos) return;

      const radius = 8 + Math.abs(neuron.value) * 4;

      // Draw neuron circle
      const hue = neuron.layer === 0 ? 240 : neuron.layer === layers.length - 1 ? 280 : 260;
      const lightness = 40 + neuron.value * 40;

      ctx.fillStyle = `hsl(${hue}, 100%, ${lightness}%)`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw glow for active neurons
      if (Math.abs(neuron.value) > 0.3) {
        ctx.strokeStyle = `hsl(${hue}, 100%, 60%, ${Math.abs(neuron.value) * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius + 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw value text for output neurons
      if (neuron.layer === layers.length - 1) {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(neuron.value.toFixed(2), pos.x, pos.y);
      }
    });

    // Draw layer labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';

    layers.forEach((layer, layerIndex) => {
      const x = (layerIndex + 1) * layerSpacing;
      const label =
        layerIndex === 0
          ? 'Input'
          : layerIndex === layers.length - 1
            ? 'Output'
            : `Hidden ${layerIndex}`;
      ctx.fillText(label, x, 25);
    });
  }, [neurons, connections, width, height, animationProgress]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full border border-border rounded-lg bg-background"
    />
  );
}
