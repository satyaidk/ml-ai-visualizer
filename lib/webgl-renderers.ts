// WebGL Renderers for 2D visualizations

import {
  createShaderProgram,
  createBuffer,
  setupVertexAttribute,
  clearCanvas,
  hexToRGB,
  setUniform3f,
  setUniform1f,
  setUniformMatrix4fv,
  createOrthographicMatrix,
} from './webgl-utils';

export interface Point2D {
  x: number;
  y: number;
  color?: string;
  radius?: number;
}

const POINT_VERTEX_SHADER = `
  attribute vec2 position;
  attribute vec3 color;
  uniform mat4 projection;
  
  varying vec3 vColor;
  
  void main() {
    vColor = color;
    gl_Position = projection * vec4(position, 0.0, 1.0);
    gl_PointSize = 8.0;
  }
`;

const POINT_FRAGMENT_SHADER = `
  precision mediump float;
  varying vec3 vColor;
  
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

const LINE_VERTEX_SHADER = `
  attribute vec2 position;
  uniform mat4 projection;
  
  void main() {
    gl_Position = projection * vec4(position, 0.0, 1.0);
  }
`;

const LINE_FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec3 color;
  
  void main() {
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface WebGLRenderer {
  gl: WebGLRenderingContext;
  canvas: HTMLCanvasElement;
  pointProgram: WebGLProgram;
  lineProgram: WebGLProgram;
  destroy(): void;
}

export function createRenderer(canvas: HTMLCanvasElement): WebGLRenderer | null {
  const gl = canvas.getContext('webgl');
  if (!gl) return null;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const pointProgram = createShaderProgram(gl, POINT_VERTEX_SHADER, POINT_FRAGMENT_SHADER);
  if (!pointProgram) return null;

  const lineProgram = createShaderProgram(gl, LINE_VERTEX_SHADER, LINE_FRAGMENT_SHADER);
  if (!lineProgram) return null;

  return {
    gl,
    canvas,
    pointProgram,
    lineProgram,
    destroy() {
      gl.deleteProgram(pointProgram);
      gl.deleteProgram(lineProgram);
    },
  };
}

export function renderPoints(
  renderer: WebGLRenderer,
  points: Point2D[],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number,
  padding: number = 40
): void {
  const { gl, canvas, pointProgram } = renderer;

  clearCanvas(gl);

  if (points.length === 0) return;

  const plotWidth = canvas.width - padding * 2;
  const plotHeight = canvas.height - padding * 2;

  // Prepare position data
  const positions: number[] = [];
  const colors: number[] = [];

  points.forEach((point) => {
    // Normalize to 0-1 space then map to canvas
    const normX = (point.x - minX) / (maxX - minX);
    const normY = (point.y - minY) / (maxY - minY);

    const canvasX = padding + normX * plotWidth;
    const canvasY = canvas.height - (padding + normY * plotHeight);

    positions.push(canvasX, canvasY);

    // Get color
    const [r, g, b] = hexToRGB(point.color || '#94a3b8');
    colors.push(r, g, b);
  });

  gl.useProgram(pointProgram);

  const positionBuffer = createBuffer(gl, positions);
  const colorBuffer = createBuffer(gl, colors);

  if (positionBuffer && colorBuffer) {
    const positionAttributeLocation = gl.getAttribLocation(pointProgram, 'position');
    const colorAttributeLocation = gl.getAttribLocation(pointProgram, 'color');

    setupVertexAttribute(gl, positionBuffer, positionAttributeLocation, 2);
    setupVertexAttribute(gl, colorBuffer, colorAttributeLocation, 3);

    // Set projection matrix
    const projMatrix = createOrthographicMatrix(canvas.width, canvas.height);
    const projLocation = gl.getUniformLocation(pointProgram, 'projection');
    gl.uniformMatrix4fv(projLocation, false, new Float32Array(projMatrix));

    gl.drawArrays(gl.POINTS, 0, points.length);

    gl.deleteBuffer(positionBuffer);
    gl.deleteBuffer(colorBuffer);
  }
}

export function renderLine(
  renderer: WebGLRenderer,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string = '#ff6b6b',
  padding: number = 40
): void {
  const { gl, canvas, lineProgram } = renderer;

  const plotWidth = canvas.width - padding * 2;
  const plotHeight = canvas.height - padding * 2;

  // Convert data coordinates to canvas coordinates
  const canvasX1 = padding + (x1 / 100) * (plotWidth / 2) + plotWidth / 2;
  const canvasY1 = canvas.height - (padding + (y1 / 100) * (plotHeight / 2) + plotHeight / 2);

  const canvasX2 = padding + (x2 / 100) * (plotWidth / 2) + plotWidth / 2;
  const canvasY2 = canvas.height - (padding + (y2 / 100) * (plotHeight / 2) + plotHeight / 2);

  const positions = [canvasX1, canvasY1, canvasX2, canvasY2];

  gl.useProgram(lineProgram);

  const positionBuffer = createBuffer(gl, positions);
  if (positionBuffer) {
    const positionAttributeLocation = gl.getAttribLocation(lineProgram, 'position');
    setupVertexAttribute(gl, positionBuffer, positionAttributeLocation, 2);

    // Set color
    const [r, g, b] = hexToRGB(color);
    setUniform3f(gl, lineProgram, 'color', r, g, b);

    // Set projection matrix
    const projMatrix = createOrthographicMatrix(canvas.width, canvas.height);
    setUniformMatrix4fv(gl, lineProgram, 'projection', projMatrix);

    gl.lineWidth(2);
    gl.drawArrays(gl.LINE_STRIP, 0, 2);

    gl.deleteBuffer(positionBuffer);
  }
}

export function renderGrid(
  renderer: WebGLRenderer,
  padding: number = 40,
  gridDivisions: number = 5,
  gridColor: string = '#64748b'
): void {
  const { gl, canvas, lineProgram } = renderer;

  gl.useProgram(lineProgram);

  const plotWidth = canvas.width - padding * 2;
  const plotHeight = canvas.height - padding * 2;

  const [r, g, b] = hexToRGB(gridColor);
  setUniform3f(gl, lineProgram, 'color', r, g, b);

  // Set projection matrix
  const projMatrix = createOrthographicMatrix(canvas.width, canvas.height);
  setUniformMatrix4fv(gl, lineProgram, 'projection', projMatrix);

  gl.lineWidth(1);

  // Draw vertical grid lines
  for (let i = 0; i <= gridDivisions; i++) {
    const x = padding + (i / gridDivisions) * plotWidth;

    const positions = [x, padding, x, padding + plotHeight];
    const positionBuffer = createBuffer(gl, positions);

    if (positionBuffer) {
      const positionAttributeLocation = gl.getAttribLocation(lineProgram, 'position');
      setupVertexAttribute(gl, positionBuffer, positionAttributeLocation, 2);
      gl.drawArrays(gl.LINE_STRIP, 0, 2);
      gl.deleteBuffer(positionBuffer);
    }
  }

  // Draw horizontal grid lines
  for (let i = 0; i <= gridDivisions; i++) {
    const y = padding + (i / gridDivisions) * plotHeight;

    const positions = [padding, y, padding + plotWidth, y];
    const positionBuffer = createBuffer(gl, positions);

    if (positionBuffer) {
      const positionAttributeLocation = gl.getAttribLocation(lineProgram, 'position');
      setupVertexAttribute(gl, positionBuffer, positionAttributeLocation, 2);
      gl.drawArrays(gl.LINE_STRIP, 0, 2);
      gl.deleteBuffer(positionBuffer);
    }
  }
}
