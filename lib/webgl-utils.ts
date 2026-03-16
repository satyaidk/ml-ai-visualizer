// WebGL Utilities for GPU-accelerated rendering

export interface WebGLResources {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  positionBuffer: WebGLBuffer;
  colorBuffer: WebGLBuffer;
  indexBuffer: WebGLBuffer;
  positionAttributeLocation: number;
  colorAttributeLocation: number;
  elementCount: number;
}

export function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export function initializeWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return null;

  // Set viewport
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Enable blending for transparency
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  return gl as WebGLRenderingContext;
}

export function createShaderProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking failed:', gl.getProgramInfoLog(program));
    return null;
  }

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

export function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(
      `Shader compilation failed (${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'}):`,
      gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function createBuffer(
  gl: WebGLRenderingContext,
  data: number[],
  target: number = gl.ARRAY_BUFFER
): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  if (!buffer) return null;

  gl.bindBuffer(target, buffer);
  gl.bufferData(target, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(target, null);

  return buffer;
}

export function createElementBuffer(
  gl: WebGLRenderingContext,
  indices: number[]
): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  if (!buffer) return null;

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return buffer;
}

export function setupVertexAttribute(
  gl: WebGLRenderingContext,
  buffer: WebGLBuffer,
  attributeLocation: number,
  size: number,
  stride: number = 0,
  offset: number = 0
): void {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(attributeLocation, size, gl.FLOAT, false, stride, offset);
  gl.enableVertexAttribArray(attributeLocation);
}

export function clearCanvas(
  gl: WebGLRenderingContext,
  r: number = 0.056,
  g: number = 0.102,
  b: number = 0.163,
  a: number = 1.0
): void {
  gl.clearColor(r, g, b, a); // Dark blue (#0f1a2a)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function createOrthographicMatrix(
  width: number,
  height: number
): number[] {
  // OpenGL orthographic projection matrix (left, right, bottom, top, near, far)
  const left = 0;
  const right = width;
  const bottom = height;
  const top = 0;
  const near = -1;
  const far = 1;

  return [
    2 / (right - left),
    0,
    0,
    0,
    0,
    2 / (top - bottom),
    0,
    0,
    0,
    0,
    -2 / (far - near),
    0,
    -(right + left) / (right - left),
    -(top + bottom) / (top - bottom),
    -(far + near) / (far - near),
    1,
  ];
}

// Multiply two 4x4 matrices
export function multiplyMatrices(a: number[], b: number[]): number[] {
  const result = new Array(16).fill(0);

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[i * 4 + k] * b[k * 4 + j];
      }
      result[i * 4 + j] = sum;
    }
  }

  return result;
}

// Create translation matrix
export function createTranslationMatrix(x: number, y: number, z: number = 0): number[] {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
}

// Create scaling matrix
export function createScaleMatrix(x: number, y: number, z: number = 1): number[] {
  return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
}

// Convert hex color to RGB normalized (0-1)
export function hexToRGB(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];

  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}

export function setUniform1f(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  value: number
): void {
  const location = gl.getUniformLocation(program, name);
  if (location !== null) {
    gl.uniform1f(location, value);
  }
}

export function setUniform2f(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  x: number,
  y: number
): void {
  const location = gl.getUniformLocation(program, name);
  if (location !== null) {
    gl.uniform2f(location, x, y);
  }
}

export function setUniform3f(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  x: number,
  y: number,
  z: number
): void {
  const location = gl.getUniformLocation(program, name);
  if (location !== null) {
    gl.uniform3f(location, x, y, z);
  }
}

export function setUniform4f(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  x: number,
  y: number,
  z: number,
  w: number
): void {
  const location = gl.getUniformLocation(program, name);
  if (location !== null) {
    gl.uniform4f(location, x, y, z, w);
  }
}

export function setUniformMatrix4fv(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  name: string,
  matrix: number[]
): void {
  const location = gl.getUniformLocation(program, name);
  if (location !== null) {
    gl.uniformMatrix4fv(location, false, new Float32Array(matrix));
  }
}
