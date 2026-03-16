// Machine Learning algorithms visualization

export interface Point {
  x: number;
  y: number;
  value?: number;
  cluster?: number;
}

export interface DataPoint2D {
  x: number;
  y: number;
  label?: number;
}

// Gradient Descent Visualization
export function generateRegressionData(
  numPoints: number = 50,
  slope: number = 2,
  intercept: number = 1,
  noise: number = 5
): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < numPoints; i++) {
    const x = Math.random() * 10 - 5;
    const y = slope * x + intercept + (Math.random() - 0.5) * noise;
    points.push({ x, y, value: y });
  }
  return points;
}

export interface RegressionLine {
  slope: number;
  intercept: number;
  loss: number;
}

export function initializeRegressionLine(): RegressionLine {
  return {
    slope: Math.random() * 4 - 2,
    intercept: Math.random() * 4 - 2,
    loss: 0,
  };
}

export function calculateMSE(
  data: Point[],
  slope: number,
  intercept: number
): number {
  let sum = 0;
  data.forEach((point) => {
    const predicted = slope * point.x + intercept;
    sum += Math.pow(point.y - predicted, 2);
  });
  return sum / data.length;
}

export function gradientDescentStep(
  line: RegressionLine,
  data: Point[],
  learningRate: number
): RegressionLine {
  const n = data.length;
  let slopeGradient = 0;
  let interceptGradient = 0;

  data.forEach((point) => {
    const predicted = line.slope * point.x + line.intercept;
    const error = predicted - point.y;
    slopeGradient += (2 * error * point.x) / n;
    interceptGradient += (2 * error) / n;
  });

  return {
    slope: line.slope - learningRate * slopeGradient,
    intercept: line.intercept - learningRate * interceptGradient,
    loss: calculateMSE(data, line.slope, line.intercept),
  };
}

// K-Means Clustering
export interface Cluster {
  centroid: { x: number; y: number };
  points: Point[];
  color: string;
}

export function generateClusterData(k: number = 3, pointsPerCluster: number = 20): Point[] {
  const points: Point[] = [];
  const centerX = 0;
  const centerY = 0;

  for (let cluster = 0; cluster < k; cluster++) {
    const angle = (cluster / k) * Math.PI * 2;
    const cx = centerX + Math.cos(angle) * 8;
    const cy = centerY + Math.sin(angle) * 8;

    for (let i = 0; i < pointsPerCluster; i++) {
      const x = cx + (Math.random() - 0.5) * 3;
      const y = cy + (Math.random() - 0.5) * 3;
      points.push({ x, y, cluster: Math.floor(Math.random() * k) });
    }
  }

  return points;
}

export function initializeCentroids(k: number, bounds: { minX: number; maxX: number; minY: number; maxY: number }): Point[] {
  const centroids: Point[] = [];
  for (let i = 0; i < k; i++) {
    centroids.push({
      x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
      y: bounds.minY + Math.random() * (bounds.maxY - bounds.minY),
    });
  }
  return centroids;
}

export function euclideanDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export function assignPointsToClusters(
  points: Point[],
  centroids: Point[]
): Point[] {
  return points.map((point) => {
    let nearestCluster = 0;
    let minDistance = Infinity;

    centroids.forEach((centroid, index) => {
      const distance = euclideanDistance(point, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCluster = index;
      }
    });

    return { ...point, cluster: nearestCluster };
  });
}

export function updateCentroids(points: Point[], k: number): Point[] {
  const newCentroids: Point[] = [];

  for (let cluster = 0; cluster < k; cluster++) {
    const clusterPoints = points.filter((p) => p.cluster === cluster);

    if (clusterPoints.length > 0) {
      const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
      const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
      newCentroids.push({ x: avgX, y: avgY });
    } else {
      newCentroids.push({
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
      });
    }
  }

  return newCentroids;
}

export function kMeansStep(
  points: Point[],
  centroids: Point[]
): { points: Point[]; centroids: Point[] } {
  const assigned = assignPointsToClusters(points, centroids);
  const newCentroids = updateCentroids(assigned, centroids.length);
  return { points: assigned, centroids: newCentroids };
}

export const clusterColors = [
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#f9ca24',
  '#6c5ce7',
  '#a29bfe',
];

// Decision Tree visualization
export interface TreeNode {
  id: string;
  feature: string;
  threshold?: number;
  samples: number;
  value: number[];
  children?: { left?: TreeNode; right?: TreeNode };
  isLeaf: boolean;
}

export function generateDecisionTreeData(
  numSamples: number = 100
): { points: DataPoint2D[]; labels: number[] } {
  const points: DataPoint2D[] = [];
  const labels: number[] = [];

  for (let i = 0; i < numSamples; i++) {
    const x = Math.random() * 10;
    const y = Math.random() * 10;

    // Simple classification rule
    const label = x > 5 && y > 5 ? 1 : 0;

    points.push({ x, y });
    labels.push(label);
  }

  return { points, labels };
}
