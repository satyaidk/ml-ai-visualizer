// Simple CNN Models for visualization

import { ImageData2D, applyKernel, maxPooling, applyReLU } from './image-processing';

export interface ConvLayer {
  name: string;
  filters: number[][][];
  bias: number[];
  output?: ImageData2D[];
  stride: number;
  padding: number;
}

export interface PoolingLayer {
  name: string;
  poolSize: number;
  output?: ImageData2D;
}

export interface ActivationLayer {
  name: string;
  type: 'relu' | 'sigmoid' | 'softmax';
  output?: ImageData2D;
}

export interface CNNModel {
  layers: (ConvLayer | PoolingLayer | ActivationLayer)[];
  inputShape: [number, number, number];
}

/**
 * Create a simple CNN filter (kernel)
 */
export function createFilter(size: number = 3): number[][] {
  const filter: number[][] = [];
  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      row.push((Math.random() - 0.5) * 0.5);
    }
    filter.push(row);
  }
  return filter;
}

/**
 * Create a convolutional layer
 */
export function createConvLayer(
  name: string,
  numFilters: number,
  filterSize: number = 3,
  stride: number = 1,
  padding: number = 0
): ConvLayer {
  const filters: number[][][] = [];

  for (let i = 0; i < numFilters; i++) {
    filters.push(createFilter(filterSize));
  }

  return {
    name,
    filters,
    bias: Array(numFilters).fill(0.1),
    stride,
    padding,
  };
}

/**
 * Apply convolution operation
 */
export function convolution(
  image: ImageData2D,
  filters: number[][][],
  stride: number = 1,
  padding: number = 0
): ImageData2D[] {
  const outputs: ImageData2D[] = [];

  filters.forEach((filter) => {
    const kernelSize = filter.length;

    // Calculate output dimensions
    const outputHeight = Math.floor((image.height + 2 * padding - kernelSize) / stride) + 1;
    const outputWidth = Math.floor((image.width + 2 * padding - kernelSize) / stride) + 1;

    const output: number[][] = [];

    for (let y = 0; y < outputHeight; y++) {
      const row: number[] = [];
      for (let x = 0; x < outputWidth; x++) {
        let sum = 0;

        // Convolve
        for (let ky = 0; ky < kernelSize; ky++) {
          for (let kx = 0; kx < kernelSize; kx++) {
            const iy = y * stride + ky - padding;
            const ix = x * stride + kx - padding;

            if (iy >= 0 && iy < image.height && ix >= 0 && ix < image.width) {
              sum += (image.data[iy]?.[ix] ?? 0) * filter[ky][kx];
            }
          }
        }

        // Add bias and apply ReLU
        const activated = Math.max(0, sum + 0.01);
        row.push(Math.min(1, activated));
      }
      output.push(row);
    }

    outputs.push({
      data: output,
      width: outputWidth,
      height: outputHeight,
      channels: 1,
    });
  });

  return outputs;
}

/**
 * Simple MNIST CNN Model
 */
export function createMNISTModel(): CNNModel {
  return {
    layers: [
      createConvLayer('conv1', 8, 3, 1, 0),
      {
        name: 'relu1',
        type: 'relu',
      } as ActivationLayer,
      {
        name: 'pool1',
        poolSize: 2,
      } as PoolingLayer,
      createConvLayer('conv2', 16, 3, 1, 0),
      {
        name: 'relu2',
        type: 'relu',
      } as ActivationLayer,
      {
        name: 'pool2',
        poolSize: 2,
      } as PoolingLayer,
    ],
    inputShape: [28, 28, 1],
  };
}

/**
 * Forward pass through CNN
 */
export function forwardPass(model: CNNModel, input: ImageData2D): ImageData2D[] {
  let current = input;
  const outputs: ImageData2D[] = [input];

  for (const layer of model.layers) {
    if ('filters' in layer) {
      // Convolutional layer
      const convLayer = layer as ConvLayer;
      const results = convolution(current, convLayer.filters, convLayer.stride, convLayer.padding);

      // Take the first output channel for visualization
      if (results.length > 0) {
        current = results[0];
        outputs.push(current);
      }
    } else if ((layer as PoolingLayer).poolSize) {
      // Pooling layer
      const poolLayer = layer as PoolingLayer;
      current = maxPooling(current, poolLayer.poolSize);
      outputs.push(current);
    } else {
      // Activation layer
      const actLayer = layer as ActivationLayer;
      if (actLayer.type === 'relu') {
        current = applyReLU(current);
        outputs.push(current);
      }
    }
  }

  return outputs;
}

/**
 * Get filter visualization
 */
export function visualizeFilter(filter: number[][], normalized: boolean = true): ImageData2D {
  const minVal = Math.min(...filter.flat());
  const maxVal = Math.max(...filter.flat());
  const range = maxVal - minVal || 1;

  const normalized_data = filter.map((row) =>
    row.map((val) => (normalized ? (val - minVal) / range : val))
  );

  return {
    data: normalized_data,
    width: filter[0].length,
    height: filter.length,
    channels: 1,
  };
}

/**
 * Create a simple feature map visualization
 */
export function createFeatureMapGrid(
  featureMaps: ImageData2D[],
  gridSize: number = 4
): ImageData2D {
  const mapWidth = featureMaps[0]?.width ?? 28;
  const mapHeight = featureMaps[0]?.height ?? 28;

  const gridWidth = mapWidth * gridSize;
  const gridHeight = mapHeight * gridSize;

  const grid: number[][] = Array(gridHeight)
    .fill(null)
    .map(() => Array(gridWidth).fill(0));

  featureMaps.slice(0, gridSize * gridSize).forEach((map, idx) => {
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;

    for (let y = 0; y < mapHeight && y + row * mapHeight < gridHeight; y++) {
      for (let x = 0; x < mapWidth && x + col * mapWidth < gridWidth; x++) {
        const value = map.data[y]?.[x] ?? 0;
        grid[y + row * mapHeight][x + col * mapWidth] = value;
      }
    }
  });

  return {
    data: grid,
    width: gridWidth,
    height: gridHeight,
    channels: 1,
  };
}

/**
 * Get model predictions on image
 */
export function predictDigit(
  model: CNNModel,
  input: ImageData2D
): {
  predictions: number[];
  confidence: number[];
} {
  const outputs = forwardPass(model, input);
  const finalOutput = outputs[outputs.length - 1];

  // Simplified prediction: count activation density in different quadrants
  const predictions: number[] = [];
  const confidence: number[] = [];

  for (let digit = 0; digit < 10; digit++) {
    let sum = 0;
    const quadrant = Math.floor(digit / 2);
    const offset = digit % 2;

    for (let i = 0; i < finalOutput.height; i++) {
      for (let j = 0; j < finalOutput.width; j++) {
        const val = finalOutput.data[i]?.[j] ?? 0;

        // Simple heuristic based on quadrant
        if (quadrant === Math.floor((i / finalOutput.height) * 2)) {
          sum += val;
        }
      }
    }

    predictions.push(digit);
    confidence.push(Math.max(0, Math.min(1, sum / 100)));
  }

  return {
    predictions,
    confidence,
  };
}

/**
 * Create simple filters for edge detection
 */
export function createEdgeDetectionFilters(): number[][][] {
  return [
    // Sobel X
    [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ],
    // Sobel Y
    [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ],
    // Laplacian
    [
      [0, -1, 0],
      [-1, 4, -1],
      [0, -1, 0],
    ],
  ];
}
