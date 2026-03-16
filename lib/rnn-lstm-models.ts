/**
 * RNN/LSTM Sequence Modeling Library
 * Educational implementation for visualizing recurrent neural networks
 */

export interface SequenceData {
  input: number[][];
  target: number[];
}

export interface HiddenState {
  values: number[];
  timestamp: number;
}

export interface LSTMCellState {
  hidden: number[];
  cell: number[];
  gates: {
    input: number[];
    forget: number[];
    output: number[];
  };
}

export interface RNNConfig {
  inputSize: number;
  hiddenSize: number;
  outputSize: number;
  learningRate: number;
}

/**
 * Simple RNN Cell
 * Hidden state: h_t = tanh(W_ih * x_t + W_hh * h_{t-1} + b_h)
 */
export class SimpleRNN {
  private Wxh: number[][]; // Input to hidden
  private Whh: number[][]; // Hidden to hidden
  private Why: number[][]; // Hidden to output
  private bh: number[];
  private by: number[];
  private config: RNNConfig;

  constructor(config: RNNConfig) {
    this.config = config;

    // Initialize weights with small random values
    this.Wxh = this.initializeMatrix(config.inputSize, config.hiddenSize, 0.01);
    this.Whh = this.initializeMatrix(config.hiddenSize, config.hiddenSize, 0.01);
    this.Why = this.initializeMatrix(config.hiddenSize, config.outputSize, 0.01);
    this.bh = Array(config.hiddenSize).fill(0);
    this.by = Array(config.outputSize).fill(0);
  }

  private initializeMatrix(rows: number, cols: number, scale: number): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        row.push((Math.random() - 0.5) * 2 * scale);
      }
      matrix.push(row);
    }
    return matrix;
  }

  /**
   * Forward pass through one time step
   */
  forwardStep(input: number[], prevHidden: number[]): {
    hidden: number[];
    output: number[];
  } {
    // h_t = tanh(W_ih * x_t + W_hh * h_{t-1} + b_h)
    const hidden = this.tanh(
      this.add(
        this.add(this.matmul(input, this.Wxh), this.matmul(prevHidden, this.Whh)),
        this.bh
      )
    );

    // y_t = softmax(W_hy * h_t + b_y)
    const logits = this.add(this.matmul(hidden, this.Why), this.by);
    const output = this.softmax(logits);

    return { hidden, output };
  }

  /**
   * Forward pass through entire sequence
   */
  forwardSequence(
    sequence: number[][],
    initialHidden: number[] = Array(this.config.hiddenSize).fill(0)
  ): {
    outputs: number[][];
    hiddenStates: number[][];
  } {
    let hidden = initialHidden;
    const outputs: number[][] = [];
    const hiddenStates: number[][] = [hidden];

    for (const input of sequence) {
      const result = this.forwardStep(input, hidden);
      outputs.push(result.output);
      hidden = result.hidden;
      hiddenStates.push([...hidden]);
    }

    return { outputs, hiddenStates };
  }

  private matmul(x: number[], W: number[][]): number[] {
    return W.map((row) => this.dot(x, row));
  }

  private dot(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  private add(a: number[], b: number[]): number[] {
    return a.map((val, i) => val + b[i]);
  }

  private tanh(x: number[]): number[] {
    return x.map((val) => Math.tanh(val));
  }

  private softmax(x: number[]): number[] {
    const shifted = x.map((val) => val - Math.max(...x));
    const exp = shifted.map((val) => Math.exp(val));
    const sum = exp.reduce((a, b) => a + b);
    return exp.map((val) => val / sum);
  }
}

/**
 * LSTM Cell - Long Short-Term Memory
 * Includes input, forget, and output gates for better gradient flow
 */
export class LSTMCell {
  private Wxh: number[][];
  private Whh: number[][];
  private Why: number[][];
  private bh: number[];
  private by: number[];
  private config: RNNConfig;
  private gateSize: number; // Usually 4x hidden size for 4 gates

  constructor(config: RNNConfig) {
    this.config = config;
    this.gateSize = config.hiddenSize * 4;

    // LSTM weights - need 4x hidden size for 4 gates (input, forget, cell, output)
    this.Wxh = this.initializeMatrix(config.inputSize, this.gateSize, 0.01);
    this.Whh = this.initializeMatrix(config.hiddenSize, this.gateSize, 0.01);
    this.Why = this.initializeMatrix(config.hiddenSize, config.outputSize, 0.01);
    this.bh = Array(this.gateSize).fill(0);
    this.by = Array(config.outputSize).fill(0);
  }

  private initializeMatrix(rows: number, cols: number, scale: number): number[][] {
    const matrix: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        row.push((Math.random() - 0.5) * 2 * scale);
      }
      matrix.push(row);
    }
    return matrix;
  }

  /**
   * Forward pass through LSTM cell
   */
  forwardStep(
    input: number[],
    prevHidden: number[],
    prevCell: number[]
  ): { hidden: number[]; cell: number[]; output: number[]; state: LSTMCellState } {
    const h = this.config.hiddenSize;

    // Compute gates
    const gates = this.add(
      this.add(this.matmul(input, this.Wxh), this.matmul(prevHidden, this.Whh)),
      this.bh
    );

    // Split gates: [inputGate, forgetGate, cellGate, outputGate]
    const inputGate = this.sigmoid(this.slice(gates, 0, h));
    const forgetGate = this.sigmoid(this.slice(gates, h, 2 * h));
    const cellGate = this.tanh(this.slice(gates, 2 * h, 3 * h));
    const outputGate = this.sigmoid(this.slice(gates, 3 * h, 4 * h));

    // Update cell state: C_t = f_t * C_{t-1} + i_t * ~C_t
    const cell = this.add(
      this.elementWiseMultiply(forgetGate, prevCell),
      this.elementWiseMultiply(inputGate, cellGate)
    );

    // Update hidden state: h_t = o_t * tanh(C_t)
    const hidden = this.elementWiseMultiply(outputGate, this.tanh(cell));

    // Compute output
    const logits = this.add(this.matmul(hidden, this.Why), this.by);
    const output = this.softmax(logits);

    return {
      hidden,
      cell,
      output,
      state: {
        hidden,
        cell,
        gates: {
          input: inputGate,
          forget: forgetGate,
          output: outputGate,
        },
      },
    };
  }

  /**
   * Forward pass through entire sequence
   */
  forwardSequence(
    sequence: number[][],
    initialHidden: number[] = Array(this.config.hiddenSize).fill(0),
    initialCell: number[] = Array(this.config.hiddenSize).fill(0)
  ): {
    outputs: number[][];
    hiddenStates: number[][];
    cellStates: number[][];
    cellStates2D: LSTMCellState[];
  } {
    let hidden = initialHidden;
    let cell = initialCell;
    const outputs: number[][] = [];
    const hiddenStates: number[][] = [hidden];
    const cellStates: number[][] = [cell];
    const cellStates2D: LSTMCellState[] = [];

    for (const input of sequence) {
      const result = this.forwardStep(input, hidden, cell);
      outputs.push(result.output);
      hidden = result.hidden;
      cell = result.cell;
      hiddenStates.push([...hidden]);
      cellStates.push([...cell]);
      cellStates2D.push(result.state);
    }

    return { outputs, hiddenStates, cellStates, cellStates2D };
  }

  private matmul(x: number[], W: number[][]): number[] {
    return W.map((row) => this.dot(x, row));
  }

  private dot(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * (b[i] || 0), 0);
  }

  private add(a: number[], b: number[]): number[] {
    return a.map((val, i) => val + (b[i] || 0));
  }

  private slice(arr: number[], start: number, end: number): number[] {
    return arr.slice(start, end);
  }

  private sigmoid(x: number[]): number[] {
    return x.map((val) => 1 / (1 + Math.exp(-val)));
  }

  private tanh(x: number[]): number[] {
    return x.map((val) => Math.tanh(val));
  }

  private softmax(x: number[]): number[] {
    const maxVal = Math.max(...x);
    const shifted = x.map((val) => val - maxVal);
    const exp = shifted.map((val) => Math.exp(val));
    const sum = exp.reduce((a, b) => a + b, 0);
    return exp.map((val) => sum > 0 ? val / sum : 1 / x.length);
  }

  private elementWiseMultiply(a: number[], b: number[]): number[] {
    return a.map((val, i) => val * (b[i] || 0));
  }
}

/**
 * Generate character-level sequence data
 */
export function generateCharacterSequence(text: string, seqLength: number = 10): SequenceData[] {
  // Create vocabulary
  const vocab = [...new Set(text.split(''))].sort();
  const char2idx = Object.fromEntries(vocab.map((c, i) => [c, i]));
  const vocabSize = vocab.length;

  const sequences: SequenceData[] = [];

  // Create sequences
  for (let i = 0; i < text.length - seqLength; i++) {
    const inputText = text.slice(i, i + seqLength);
    const targetChar = text[i + seqLength];

    const input = inputText.split('').map((c) => {
      const idx = char2idx[c];
      const encoding = Array(vocabSize).fill(0);
      encoding[idx] = 1;
      return encoding;
    });

    const target = Array(vocabSize).fill(0);
    target[char2idx[targetChar]] = 1;

    sequences.push({ input, target });
  }

  return sequences;
}

/**
 * Generate time series data (e.g., sine wave with noise)
 */
export function generateTimeSeriesData(
  length: number = 100,
  frequency: number = 0.1,
  noise: number = 0.05
): number[] {
  const data: number[] = [];
  for (let i = 0; i < length; i++) {
    const value = Math.sin(i * frequency * 2 * Math.PI) + (Math.random() - 0.5) * noise;
    data.push(Math.max(0, Math.min(1, (value + 1) / 2))); // Normalize to [0, 1]
  }
  return data;
}

/**
 * Convert time series to sequences
 */
export function timeSeriestoSequences(
  data: number[],
  seqLength: number = 10,
  predictionSteps: number = 1
): SequenceData[] {
  const sequences: SequenceData[] = [];

  for (let i = 0; i < data.length - seqLength - predictionSteps; i++) {
    const input = data.slice(i, i + seqLength).map((val) => [val]);
    const target = data.slice(i + seqLength, i + seqLength + predictionSteps);

    sequences.push({ input, target });
  }

  return sequences;
}
