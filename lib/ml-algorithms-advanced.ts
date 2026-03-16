// Advanced Machine Learning Algorithms
// SVM, Random Forest, Gaussian Mixture Models, Naive Bayes

import { Point } from './ml-algorithms';

// ==================== DATA STRUCTURES ====================

export interface ClassificationData {
  points: Point[];
  labels: number[];
}

export interface DecisionBoundary {
  grid: number[][];
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  resolution: number;
}

// ==================== SUPPORT VECTOR MACHINE ====================

export interface SVMModel {
  supportVectors: Point[];
  coefficients: number[];
  bias: number;
  kernelType: 'linear' | 'rbf' | 'polynomial';
  kernelParam: number; // gamma for RBF, degree for polynomial
}

export function generateBinaryClassificationData(
  pointsPerClass: number = 30,
  separation: number = 3
): ClassificationData {
  const points: Point[] = [];
  const labels: number[] = [];

  // Class 0 - upper left region
  for (let i = 0; i < pointsPerClass; i++) {
    const x = Math.random() * 4 - 6;
    const y = Math.random() * 4 + separation;
    points.push({ x, y });
    labels.push(0);
  }

  // Class 1 - lower right region
  for (let i = 0; i < pointsPerClass; i++) {
    const x = Math.random() * 4 + 2;
    const y = Math.random() * 4 - separation;
    points.push({ x, y });
    labels.push(1);
  }

  return { points, labels };
}

function linearKernel(x1: Point, x2: Point): number {
  return x1.x * x2.x + x1.y * x2.y;
}

function rbfKernel(x1: Point, x2: Point, gamma: number = 0.1): number {
  const dx = x1.x - x2.x;
  const dy = x1.y - x2.y;
  const distance = dx * dx + dy * dy;
  return Math.exp(-gamma * distance);
}

function polynomialKernel(x1: Point, x2: Point, degree: number = 2): number {
  const dot = x1.x * x2.x + x1.y * x2.y;
  return Math.pow(dot + 1, degree);
}

export function trainSVM(
  data: ClassificationData,
  kernelType: 'linear' | 'rbf' | 'polynomial' = 'rbf',
  kernelParam: number = 0.1,
  iterations: number = 100,
  learningRate: number = 0.01
): SVMModel {
  const { points, labels } = data;
  const n = points.length;

  // Simplified SVM training using gradient descent
  const supportIndices: number[] = [];
  const coefficients: number[] = [];

  // Select support vectors (simplified: use all points)
  for (let i = 0; i < Math.min(n, 10); i++) {
    supportIndices.push(i);
    coefficients.push((Math.random() - 0.5) * 2);
  }

  let bias = 0;

  // Training loop
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < n; i++) {
      let prediction = bias;

      const kernel =
        kernelType === 'rbf'
          ? rbfKernel
          : kernelType === 'polynomial'
            ? (a: Point, b: Point) => polynomialKernel(a, b, Math.round(kernelParam))
            : linearKernel;

      for (let j = 0; j < supportIndices.length; j++) {
        prediction += coefficients[j] * labels[supportIndices[j]] * kernel(points[i], points[supportIndices[j]]);
      }

      const error = prediction - labels[i];

      // Update bias
      bias -= learningRate * error * labels[i];
    }
  }

  return {
    supportVectors: supportIndices.map((i) => points[i]),
    coefficients,
    bias,
    kernelType,
    kernelParam,
  };
}

export function predictSVM(
  model: SVMModel,
  point: Point,
  allPoints: Point[],
  labels: number[]
): number {
  let prediction = model.bias;

  const kernel =
    model.kernelType === 'rbf'
      ? rbfKernel
      : model.kernelType === 'polynomial'
        ? (a: Point, b: Point) => polynomialKernel(a, b, Math.round(model.kernelParam))
        : linearKernel;

  for (let i = 0; i < model.supportVectors.length; i++) {
    prediction += model.coefficients[i] * labels[i] * kernel(point, model.supportVectors[i]);
  }

  return prediction > 0 ? 1 : 0;
}

// ==================== RANDOM FOREST ====================

export interface DecisionNode {
  isLeaf: boolean;
  featureIndex?: number; // 0 for x, 1 for y
  threshold?: number;
  label?: number;
  left?: DecisionNode;
  right?: DecisionNode;
}

export interface RandomForestModel {
  trees: DecisionNode[];
  numTrees: number;
  featureImportance: number[];
}

function entropy(labels: number[]): number {
  const counts: Record<number, number> = {};
  labels.forEach((label) => {
    counts[label] = (counts[label] || 0) + 1;
  });

  let ent = 0;
  const n = labels.length;
  Object.values(counts).forEach((count) => {
    if (count > 0) {
      const p = count / n;
      ent -= p * Math.log2(p);
    }
  });

  return ent;
}

function buildDecisionTree(
  points: Point[],
  labels: number[],
  depth: number = 0,
  maxDepth: number = 5
): DecisionNode {
  // Stopping criteria
  if (
    depth >= maxDepth ||
    labels.length < 2 ||
    new Set(labels).size === 1
  ) {
    const label = labels.reduce((a, b) => a + b, 0) >= labels.length / 2 ? 1 : 0;
    return { isLeaf: true, label };
  }

  let bestGain = 0;
  let bestFeature = 0;
  let bestThreshold = 0;
  let bestLeftIndices: number[] = [];
  let bestRightIndices: number[] = [];

  // Try splitting on x and y
  [0, 1].forEach((feature) => {
    const values = points.map((p) => (feature === 0 ? p.x : p.y));
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    // Try a few thresholds
    for (let i = 1; i < 5; i++) {
      const threshold = minVal + ((maxVal - minVal) / 5) * i;

      const leftIndices: number[] = [];
      const rightIndices: number[] = [];

      points.forEach((point, idx) => {
        const val = feature === 0 ? point.x : point.y;
        if (val <= threshold) {
          leftIndices.push(idx);
        } else {
          rightIndices.push(idx);
        }
      });

      if (leftIndices.length === 0 || rightIndices.length === 0) continue;

      const leftLabels = leftIndices.map((i) => labels[i]);
      const rightLabels = rightIndices.map((i) => labels[i]);

      const parentEntropy = entropy(labels);
      const leftEntropy = entropy(leftLabels);
      const rightEntropy = entropy(rightLabels);

      const gain =
        parentEntropy -
        ((leftLabels.length / labels.length) * leftEntropy +
          (rightLabels.length / labels.length) * rightEntropy);

      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = feature;
        bestThreshold = threshold;
        bestLeftIndices = leftIndices;
        bestRightIndices = rightIndices;
      }
    }
  });

  if (bestGain === 0) {
    const label = labels.reduce((a, b) => a + b, 0) >= labels.length / 2 ? 1 : 0;
    return { isLeaf: true, label };
  }

  const leftPoints = bestLeftIndices.map((i) => points[i]);
  const leftLabels = bestLeftIndices.map((i) => labels[i]);
  const rightPoints = bestRightIndices.map((i) => points[i]);
  const rightLabels = bestRightIndices.map((i) => labels[i]);

  return {
    isLeaf: false,
    featureIndex: bestFeature,
    threshold: bestThreshold,
    left: buildDecisionTree(leftPoints, leftLabels, depth + 1, maxDepth),
    right: buildDecisionTree(rightPoints, rightLabels, depth + 1, maxDepth),
  };
}

export function trainRandomForest(
  data: ClassificationData,
  numTrees: number = 5,
  maxDepth: number = 5
): RandomForestModel {
  const trees: DecisionNode[] = [];

  for (let t = 0; t < numTrees; t++) {
    // Bootstrap sampling
    const indices: number[] = [];
    for (let i = 0; i < data.points.length; i++) {
      indices.push(Math.floor(Math.random() * data.points.length));
    }

    const points = indices.map((i) => data.points[i]);
    const labels = indices.map((i) => data.labels[i]);

    trees.push(buildDecisionTree(points, labels, 0, maxDepth));
  }

  return {
    trees,
    numTrees,
    featureImportance: [0.5, 0.5], // Simplified
  };
}

function predictTree(node: DecisionNode, point: Point): number {
  if (node.isLeaf) {
    return node.label || 0;
  }

  const val = node.featureIndex === 0 ? point.x : point.y;
  if (val <= (node.threshold || 0)) {
    return predictTree(node.left || { isLeaf: true, label: 0 }, point);
  } else {
    return predictTree(node.right || { isLeaf: true, label: 1 }, point);
  }
}

export function predictRandomForest(model: RandomForestModel, point: Point): number {
  const predictions = model.trees.map((tree) => predictTree(tree, point));
  return predictions.reduce((a, b) => a + b, 0) >= model.numTrees / 2 ? 1 : 0;
}

// ==================== GAUSSIAN MIXTURE MODELS ====================

export interface GaussianComponent {
  mean: { x: number; y: number };
  covariance: number[][];
  weight: number;
}

export interface GMMModel {
  components: GaussianComponent[];
  numComponents: number;
  logLikelihood: number;
}

function gaussianPDF(x: number, mean: number, variance: number): number {
  const exponent = -((x - mean) ** 2) / (2 * variance);
  return (1 / Math.sqrt(2 * Math.PI * variance)) * Math.exp(exponent);
}

function gaussianPDF2D(
  point: Point,
  mean: { x: number; y: number },
  covariance: number[][]
): number {
  const dx = point.x - mean.x;
  const dy = point.y - mean.y;

  const det =
    covariance[0][0] * covariance[1][1] -
    covariance[0][1] * covariance[1][0];

  const inv00 = covariance[1][1] / det;
  const inv01 = -covariance[0][1] / det;
  const inv10 = -covariance[1][0] / det;
  const inv11 = covariance[0][0] / det;

  const quad = inv00 * dx * dx + 2 * inv01 * dx * dy + inv11 * dy * dy;

  return (
    (1 / (2 * Math.PI * Math.sqrt(Math.abs(det)))) *
    Math.exp(-quad / 2)
  );
}

export function trainGMM(
  data: ClassificationData,
  numComponents: number = 3,
  iterations: number = 50
): GMMModel {
  const { points } = data;
  const n = points.length;

  // Initialize components randomly
  const components: GaussianComponent[] = [];

  for (let k = 0; k < numComponents; k++) {
    const randomIdx = Math.floor(Math.random() * n);
    components.push({
      mean: { ...points[randomIdx] },
      covariance: [
        [1, 0],
        [0, 1],
      ],
      weight: 1 / numComponents,
    });
  }

  // EM iterations
  for (let iter = 0; iter < iterations; iter++) {
    // E-step: compute responsibilities
    const responsibilities = points.map((point) => {
      const posteriors = components.map((component) => {
        return (
          component.weight *
          gaussianPDF2D(point, component.mean, component.covariance)
        );
      });

      const sum = posteriors.reduce((a, b) => a + b, 1e-10);
      return posteriors.map((p) => p / sum);
    });

    // M-step: update parameters
    for (let k = 0; k < numComponents; k++) {
      const Nk = responsibilities.reduce((sum, resp) => sum + resp[k], 0);

      if (Nk > 0) {
        // Update weight
        components[k].weight = Nk / n;

        // Update mean
        let meanX = 0,
          meanY = 0;
        for (let i = 0; i < n; i++) {
          meanX += (responsibilities[i][k] * points[i].x) / Nk;
          meanY += (responsibilities[i][k] * points[i].y) / Nk;
        }
        components[k].mean = { x: meanX, y: meanY };

        // Update covariance (simplified)
        components[k].covariance = [
          [0.5, 0],
          [0, 0.5],
        ];
      }
    }
  }

  return {
    components,
    numComponents,
    logLikelihood: 0,
  };
}

export function predictGMM(
  model: GMMModel,
  point: Point
): { component: number; probability: number } {
  const posteriors = model.components.map((component) => {
    return (
      component.weight *
      gaussianPDF2D(point, component.mean, component.covariance)
    );
  });

  const total = posteriors.reduce((a, b) => a + b, 1e-10);
  const component = posteriors.indexOf(Math.max(...posteriors));

  return {
    component,
    probability: posteriors[component] / total,
  };
}

// ==================== NAIVE BAYES ====================

export interface NaiveBayesModel {
  means: number[][];
  variances: number[][];
  priors: number[];
  numClasses: number;
}

export function trainNaiveBayes(data: ClassificationData): NaiveBayesModel {
  const { points, labels } = data;
  const numClasses = Math.max(...labels) + 1;

  const means: number[][] = [];
  const variances: number[][] = [];
  const priors: number[] = [];

  for (let c = 0; c < numClasses; c++) {
    const classIndices = labels
      .map((label, i) => (label === c ? i : -1))
      .filter((i) => i !== -1);

    priors.push(classIndices.length / points.length);

    const classPoints = classIndices.map((i) => points[i]);

    // Calculate mean for x and y
    let meanX = 0,
      meanY = 0;
    classPoints.forEach((p) => {
      meanX += p.x;
      meanY += p.y;
    });
    meanX /= classPoints.length;
    meanY /= classPoints.length;

    // Calculate variance for x and y
    let varX = 0,
      varY = 0;
    classPoints.forEach((p) => {
      varX += (p.x - meanX) ** 2;
      varY += (p.y - meanY) ** 2;
    });
    varX /= classPoints.length;
    varY /= classPoints.length;

    means.push([meanX, meanY]);
    variances.push([varX, varY]);
  }

  return {
    means,
    variances,
    priors,
    numClasses,
  };
}

export function predictNaiveBayes(model: NaiveBayesModel, point: Point): number {
  const posteriors = [];

  for (let c = 0; c < model.numClasses; c++) {
    let posterior = Math.log(model.priors[c]);

    // Calculate likelihood for x
    const meanX = model.means[c][0];
    const varX = model.variances[c][0];
    const likelihoodX = gaussianPDF(point.x, meanX, varX);

    // Calculate likelihood for y
    const meanY = model.means[c][1];
    const varY = model.variances[c][1];
    const likelihoodY = gaussianPDF(point.y, meanY, varY);

    posterior += Math.log(likelihoodX + 1e-10) + Math.log(likelihoodY + 1e-10);

    posteriors.push(posterior);
  }

  return posteriors.indexOf(Math.max(...posteriors));
}

// ==================== DECISION BOUNDARY VISUALIZATION ====================

export function generateDecisionBoundary(
  predict: (point: Point) => number,
  minX: number = -15,
  maxX: number = 15,
  minY: number = -15,
  maxY: number = 15,
  resolution: number = 0.5
): DecisionBoundary {
  const grid: number[][] = [];

  for (let y = maxY; y >= minY; y -= resolution) {
    const row: number[] = [];
    for (let x = minX; x <= maxX; x += resolution) {
      const prediction = predict({ x, y });
      row.push(prediction);
    }
    grid.push(row);
  }

  return {
    grid,
    minX,
    maxX,
    minY,
    maxY,
    resolution,
  };
}
