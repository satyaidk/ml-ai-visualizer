// Neural Network visualization utilities and simulations

export interface Neuron {
  id: string;
  layer: number;
  value: number;
  bias: number;
}

export interface Connection {
  from: string;
  to: string;
  weight: number;
}

export interface NetworkConfig {
  layers: number[];
  learningRate: number;
  activation: 'sigmoid' | 'relu' | 'tanh';
}

export interface TrainingData {
  input: number[];
  output: number[];
}

// Activation functions
export const activationFunctions = {
  sigmoid: (x: number) => 1 / (1 + Math.exp(-x)),
  relu: (x: number) => Math.max(0, x),
  tanh: (x: number) => Math.tanh(x),
  linear: (x: number) => x,
};

export const activationDerivatives = {
  sigmoid: (x: number) => x * (1 - x),
  relu: (x: number) => (x > 0 ? 1 : 0),
  tanh: (x: number) => 1 - x * x,
  linear: () => 1,
};

// Create initial neural network neurons and connections
export function createNetwork(config: NetworkConfig) {
  const neurons: Neuron[] = [];
  const connections: Connection[] = [];

  let neuronId = 0;
  const neuronsByLayer: { [key: number]: Neuron[] } = {};

  // Create neurons for each layer
  config.layers.forEach((layerSize, layerIndex) => {
    neuronsByLayer[layerIndex] = [];
    for (let i = 0; i < layerSize; i++) {
      const neuron: Neuron = {
        id: `neuron-${neuronId}`,
        layer: layerIndex,
        value: 0,
        bias: Math.random() * 0.5 - 0.25,
      };
      neurons.push(neuron);
      neuronsByLayer[layerIndex].push(neuron);
      neuronId++;
    }
  });

  // Create connections between consecutive layers
  for (let i = 0; i < config.layers.length - 1; i++) {
    const currentLayer = neuronsByLayer[i];
    const nextLayer = neuronsByLayer[i + 1];

    currentLayer.forEach((fromNeuron) => {
      nextLayer.forEach((toNeuron) => {
        connections.push({
          from: fromNeuron.id,
          to: toNeuron.id,
          weight: Math.random() * 2 - 1, // Random weight between -1 and 1
        });
      });
    });
  }

  return { neurons, connections };
}

// Forward pass through the network
export function forwardPass(
  neurons: Neuron[],
  connections: Connection[],
  input: number[],
  activation: 'sigmoid' | 'relu' | 'tanh'
): Neuron[] {
  const updatedNeurons = JSON.parse(JSON.stringify(neurons));
  const activationFn = activationFunctions[activation];

  // Set input layer values
  let neuronIndex = 0;
  const inputLayerNeurons = input.length;
  for (let i = 0; i < inputLayerNeurons; i++) {
    updatedNeurons[neuronIndex + i].value = input[i];
  }

  // Calculate values for hidden and output layers
  const layers = groupNeuronsByLayer(updatedNeurons);

  for (let layerIndex = 1; layerIndex < layers.length; layerIndex++) {
    const currentLayer = layers[layerIndex];
    const previousLayer = layers[layerIndex - 1];

    currentLayer.forEach((neuron) => {
      let sum = neuron.bias;

      // Sum weighted inputs from previous layer
      previousLayer.forEach((prevNeuron) => {
        const connection = connections.find(
          (c) => c.from === prevNeuron.id && c.to === neuron.id
        );
        if (connection) {
          sum += prevNeuron.value * connection.weight;
        }
      });

      // Apply activation function
      neuron.value = activationFn(sum);
    });
  }

  return updatedNeurons;
}

// Group neurons by layer
export function groupNeuronsByLayer(neurons: Neuron[]) {
  const layers: Neuron[][] = [];
  neurons.forEach((neuron) => {
    if (!layers[neuron.layer]) {
      layers[neuron.layer] = [];
    }
    layers[neuron.layer].push(neuron);
  });
  return layers;
}

// Calculate loss (Mean Squared Error)
export function calculateMSE(predicted: number[], target: number[]): number {
  let sum = 0;
  predicted.forEach((p, i) => {
    sum += Math.pow(p - target[i], 2);
  });
  return sum / predicted.length;
}

// Simple backpropagation simulation (for visualization purposes)
export function backpropagationStep(
  neurons: Neuron[],
  connections: Connection[],
  target: number[],
  learningRate: number
): { neurons: Neuron[]; connections: Connection[] } {
  const updatedNeurons = JSON.parse(JSON.stringify(neurons));
  const updatedConnections = JSON.parse(JSON.stringify(connections));

  // Get output layer neurons
  const layers = groupNeuronsByLayer(updatedNeurons);
  const outputLayer = layers[layers.length - 1];

  // Calculate output layer deltas
  const deltas: { [key: string]: number } = {};

  outputLayer.forEach((neuron, index) => {
    const error = target[index] - neuron.value;
    deltas[neuron.id] = error * neuron.value * (1 - neuron.value); // sigmoid derivative
  });

  // Backpropagate errors and update weights
  for (let layerIndex = layers.length - 2; layerIndex >= 0; layerIndex--) {
    const currentLayer = layers[layerIndex];
    const nextLayer = layers[layerIndex + 1];

    currentLayer.forEach((neuron) => {
      let delta = 0;

      nextLayer.forEach((nextNeuron) => {
        const connection = updatedConnections.find(
          (c) => c.from === neuron.id && c.to === nextNeuron.id
        );
        if (connection && deltas[nextNeuron.id]) {
          delta += deltas[nextNeuron.id] * connection.weight;
          // Update weight
          connection.weight +=
            learningRate * deltas[nextNeuron.id] * neuron.value;
        }
      });

      if (layerIndex > 0) {
        deltas[neuron.id] = delta * neuron.value * (1 - neuron.value);
      }
    });
  }

  return { neurons: updatedNeurons, connections: updatedConnections };
}
