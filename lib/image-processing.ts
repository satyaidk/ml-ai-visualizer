// Image Processing Utilities for CNN Visualization

export interface ImageData2D {
  data: number[][];
  width: number;
  height: number;
  channels: number;
}

export interface PixelData {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Load and process an image from a Canvas element
 */
export function canvasToImageData(canvas: HTMLCanvasElement): ImageData2D | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert RGBA to grayscale
  const grayscale: number[][] = [];
  for (let i = 0; i < canvas.height; i++) {
    const row: number[] = [];
    for (let j = 0; j < canvas.width; j++) {
      const index = (i * canvas.width + j) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      // Grayscale conversion with alpha
      const gray = (r * 0.299 + g * 0.587 + b * 0.114) * (a / 255);
      row.push(gray / 255); // Normalize to 0-1
    }
    grayscale.push(row);
  }

  return {
    data: grayscale,
    width: canvas.width,
    height: canvas.height,
    channels: 1,
  };
}

/**
 * Resize image to target dimensions using bilinear interpolation
 */
export function resizeImage(
  image: ImageData2D,
  targetWidth: number,
  targetHeight: number
): ImageData2D {
  const resized: number[][] = [];

  for (let y = 0; y < targetHeight; y++) {
    const row: number[] = [];
    for (let x = 0; x < targetWidth; x++) {
      // Map target coordinates to source coordinates
      const srcX = (x / targetWidth) * image.width;
      const srcY = (y / targetHeight) * image.height;

      // Bilinear interpolation
      const x0 = Math.floor(srcX);
      const y0 = Math.floor(srcY);
      const x1 = Math.min(x0 + 1, image.width - 1);
      const y1 = Math.min(y0 + 1, image.height - 1);

      const fx = srcX - x0;
      const fy = srcY - y0;

      const v00 = image.data[y0]?.[x0] ?? 0;
      const v10 = image.data[y0]?.[x1] ?? 0;
      const v01 = image.data[y1]?.[x0] ?? 0;
      const v11 = image.data[y1]?.[x1] ?? 0;

      const v0 = v00 * (1 - fx) + v10 * fx;
      const v1 = v01 * (1 - fx) + v11 * fx;
      const value = v0 * (1 - fy) + v1 * fy;

      row.push(value);
    }
    resized.push(row);
  }

  return {
    data: resized,
    width: targetWidth,
    height: targetHeight,
    channels: 1,
  };
}

/**
 * Normalize image to 0-1 or -1 to 1 range
 */
export function normalizeImage(image: ImageData2D, range: 'unit' | 'signed' = 'unit'): ImageData2D {
  const normalized = image.data.map((row) =>
    row.map((pixel) => (range === 'unit' ? pixel : pixel * 2 - 1))
  );

  return {
    ...image,
    data: normalized,
  };
}

/**
 * Apply Gaussian blur to image
 */
export function gaussianBlur(image: ImageData2D, sigma: number = 1): ImageData2D {
  const kernel = createGaussianKernel(sigma);
  return applyKernel(image, kernel);
}

/**
 * Create a Gaussian kernel for filtering
 */
export function createGaussianKernel(sigma: number): number[][] {
  const size = Math.ceil(6 * sigma);
  const kernel: number[][] = [];

  let sum = 0;
  const center = Math.floor(size / 2);

  for (let i = 0; i < size; i++) {
    const row: number[] = [];
    for (let j = 0; j < size; j++) {
      const x = i - center;
      const y = j - center;
      const value = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      row.push(value);
      sum += value;
    }
    kernel.push(row);
  }

  // Normalize
  return kernel.map((row) => row.map((val) => val / sum));
}

/**
 * Apply a convolution kernel to image
 */
export function applyKernel(image: ImageData2D, kernel: number[][]): ImageData2D {
  const result: number[][] = [];
  const kh = kernel.length;
  const kw = kernel[0].length;
  const khy = Math.floor(kh / 2);
  const khx = Math.floor(kw / 2);

  for (let y = 0; y < image.height; y++) {
    const row: number[] = [];
    for (let x = 0; x < image.width; x++) {
      let sum = 0;

      for (let ky = 0; ky < kh; ky++) {
        for (let kx = 0; kx < kw; kx++) {
          const iy = Math.min(Math.max(y + ky - khy, 0), image.height - 1);
          const ix = Math.min(Math.max(x + kx - khx, 0), image.width - 1);
          sum += (image.data[iy]?.[ix] ?? 0) * kernel[ky][kx];
        }
      }

      row.push(Math.max(0, Math.min(1, sum)));
    }
    result.push(row);
  }

  return {
    ...image,
    data: result,
  };
}

/**
 * Apply ReLU activation
 */
export function applyReLU(image: ImageData2D): ImageData2D {
  const activated = image.data.map((row) => row.map((pixel) => Math.max(0, pixel)));

  return {
    ...image,
    data: activated,
  };
}

/**
 * Apply max pooling
 */
export function maxPooling(image: ImageData2D, poolSize: number = 2): ImageData2D {
  const newHeight = Math.floor(image.height / poolSize);
  const newWidth = Math.floor(image.width / poolSize);
  const pooled: number[][] = [];

  for (let y = 0; y < newHeight; y++) {
    const row: number[] = [];
    for (let x = 0; x < newWidth; x++) {
      let max = 0;

      for (let py = 0; py < poolSize; py++) {
        for (let px = 0; px < poolSize; px++) {
          const val = image.data[y * poolSize + py]?.[x * poolSize + px] ?? 0;
          max = Math.max(max, val);
        }
      }

      row.push(max);
    }
    pooled.push(row);
  }

  return {
    ...image,
    data: pooled,
    width: newWidth,
    height: newHeight,
  };
}

/**
 * Visualize a 2D array as canvas
 */
export function drawImageData(
  canvas: HTMLCanvasElement,
  image: ImageData2D,
  colorMap: 'grayscale' | 'heat' = 'grayscale'
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Resize canvas to match image
  canvas.width = image.width;
  canvas.height = image.height;

  const imageData = ctx.createImageData(image.width, image.height);
  const data = imageData.data;

  const getColor = (value: number): [number, number, number] => {
    if (colorMap === 'heat') {
      // Heat map: blue -> red
      if (value < 0.5) {
        const t = value * 2; // 0 to 1
        return [0, Math.floor(t * 255), 255];
      } else {
        const t = (value - 0.5) * 2; // 0 to 1
        return [Math.floor(t * 255), 255 - Math.floor(t * 128), 0];
      }
    } else {
      // Grayscale
      const gray = Math.floor(value * 255);
      return [gray, gray, gray];
    }
  };

  for (let i = 0; i < image.height; i++) {
    for (let j = 0; j < image.width; j++) {
      const value = image.data[i][j];
      const [r, g, b] = getColor(value);
      const pixelIndex = (i * image.width + j) * 4;

      data[pixelIndex] = r; // R
      data[pixelIndex + 1] = g; // G
      data[pixelIndex + 2] = b; // B
      data[pixelIndex + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Flatten 2D image to 1D array
 */
export function flattenImage(image: ImageData2D): number[] {
  const flat: number[] = [];
  for (let i = 0; i < image.height; i++) {
    for (let j = 0; j < image.width; j++) {
      flat.push(image.data[i][j]);
    }
  }
  return flat;
}

/**
 * Convert 1D array back to 2D image
 */
export function unflattenImage(
  flat: number[],
  width: number,
  height: number
): ImageData2D {
  const data: number[][] = [];
  for (let i = 0; i < height; i++) {
    const row: number[] = [];
    for (let j = 0; j < width; j++) {
      row.push(flat[i * width + j]);
    }
    data.push(row);
  }
  return { data, width, height, channels: 1 };
}

/**
 * Generate random noise image
 */
export function generateNoiseImage(width: number, height: number): ImageData2D {
  const data: number[][] = [];
  for (let i = 0; i < height; i++) {
    const row: number[] = [];
    for (let j = 0; j < width; j++) {
      row.push(Math.random());
    }
    data.push(row);
  }
  return { data, width, height, channels: 1 };
}

/**
 * Generate simple MNIST-like digit
 */
export function generateSimpleDigit(width: number = 28, height: number = 28): ImageData2D {
  const data: number[][] = [];

  for (let i = 0; i < height; i++) {
    const row: number[] = [];
    for (let j = 0; j < width; j++) {
      // Create a simple circle-like pattern
      const dx = j - width / 2;
      const dy = i - height / 2;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const value = Math.max(0, 1 - distance / (width / 2.5));
      row.push(value);
    }
    data.push(row);
  }

  return { data, width, height, channels: 1 };
}
