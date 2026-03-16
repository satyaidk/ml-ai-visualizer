/**
 * Reinforcement Learning Environments
 * Educational implementations for interactive RL visualization
 */

export interface State {
  x: number;
  y: number;
  terminal: boolean;
  reward: number;
}

export interface Episode {
  states: State[];
  actions: number[];
  rewards: number[];
  totalReward: number;
  steps: number;
}

/**
 * GridWorld Environment
 * Simple 2D grid where agent learns to reach a goal
 */
export class GridWorld {
  private gridSize: number;
  private startX: number;
  private startY: number;
  private goalX: number;
  private goalY: number;
  private agentX: number;
  private agentY: number;
  private obstacles: Set<string>;
  private stepCount: number;
  private maxSteps: number;

  constructor(gridSize: number = 5, maxSteps: number = 50) {
    this.gridSize = gridSize;
    this.maxSteps = maxSteps;
    this.startX = 0;
    this.startY = 0;
    this.goalX = gridSize - 1;
    this.goalY = gridSize - 1;
    this.agentX = this.startX;
    this.agentY = this.startY;
    this.stepCount = 0;
    this.obstacles = new Set();

    // Add some random obstacles
    for (let i = 0; i < Math.floor(gridSize * gridSize * 0.1); i++) {
      const ox = Math.floor(Math.random() * gridSize);
      const oy = Math.floor(Math.random() * gridSize);
      if ((ox !== this.startX || oy !== this.startY) && (ox !== this.goalX || oy !== this.goalY)) {
        this.obstacles.add(`${ox},${oy}`);
      }
    }
  }

  reset(): State {
    this.agentX = this.startX;
    this.agentY = this.startY;
    this.stepCount = 0;
    return this.getState();
  }

  private getState(): State {
    const isGoal = this.agentX === this.goalX && this.agentY === this.goalY;
    const isTerminal = isGoal || this.stepCount >= this.maxSteps;
    const reward = isGoal ? 1 : this.stepCount >= this.maxSteps ? -0.1 : -0.01;

    return {
      x: this.agentX,
      y: this.agentY,
      terminal: isTerminal,
      reward,
    };
  }

  /**
   * Take an action: 0=up, 1=right, 2=down, 3=left
   */
  step(action: number): State {
    if (this.stepCount >= this.maxSteps) {
      return this.getState();
    }

    const newX = this.agentX + [0, 1, 0, -1][action];
    const newY = this.agentY + [-1, 0, 1, 0][action];

    // Check bounds and obstacles
    if (newX >= 0 && newX < this.gridSize && newY >= 0 && newY < this.gridSize) {
      if (!this.obstacles.has(`${newX},${newY}`)) {
        this.agentX = newX;
        this.agentY = newY;
      }
    }

    this.stepCount++;
    return this.getState();
  }

  getGrid(): { obstacles: [number, number][]; goal: [number, number]; agent: [number, number] } {
    const obstacles: [number, number][] = [];
    this.obstacles.forEach((key) => {
      const [x, y] = key.split(',').map(Number);
      obstacles.push([x, y]);
    });

    return {
      obstacles,
      goal: [this.goalX, this.goalY],
      agent: [this.agentX, this.agentY],
    };
  }

  getGridSize(): number {
    return this.gridSize;
  }
}

/**
 * Q-Learning Agent
 * Learns optimal policy through value iteration
 */
export class QLearningAgent {
  private qTable: Map<string, number[]>;
  private alpha: number; // Learning rate
  private gamma: number; // Discount factor
  private epsilon: number; // Exploration rate
  private numActions: number;

  constructor(alpha: number = 0.1, gamma: number = 0.95, epsilon: number = 0.1, numActions: number = 4) {
    this.qTable = new Map();
    this.alpha = alpha;
    this.gamma = gamma;
    this.epsilon = epsilon;
    this.numActions = numActions;
  }

  /**
   * Get Q-values for a state
   */
  private getQValues(state: string): number[] {
    if (!this.qTable.has(state)) {
      this.qTable.set(state, Array(this.numActions).fill(0));
    }
    return this.qTable.get(state)!;
  }

  /**
   * Epsilon-greedy action selection
   */
  selectAction(state: string, training: boolean = true): number {
    if (training && Math.random() < this.epsilon) {
      // Explore: random action
      return Math.floor(Math.random() * this.numActions);
    }

    // Exploit: best action
    const qValues = this.getQValues(state);
    const maxQ = Math.max(...qValues);
    const bestActions = qValues
      .map((q, i) => (q === maxQ ? i : -1))
      .filter((i) => i !== -1);
    return bestActions[Math.floor(Math.random() * bestActions.length)];
  }

  /**
   * Update Q-values based on experience
   */
  update(state: string, action: number, reward: number, nextState: string, terminal: boolean) {
    const qValues = this.getQValues(state);
    const nextQValues = this.getQValues(nextState);
    const maxNextQ = Math.max(...nextQValues);

    // Q-learning update: Q(s,a) += α[r + γ*max(Q(s',a')) - Q(s,a)]
    const currentQ = qValues[action];
    const targetQ = terminal ? reward : reward + this.gamma * maxNextQ;
    qValues[action] = currentQ + this.alpha * (targetQ - currentQ);
  }

  /**
   * Decay exploration rate
   */
  decayEpsilon(decayRate: number = 0.995) {
    this.epsilon *= decayRate;
  }

  getQTable(): { state: string; qValues: number[] }[] {
    const table: { state: string; qValues: number[] }[] = [];
    this.qTable.forEach((qValues, state) => {
      table.push({ state, qValues });
    });
    return table;
  }
}

/**
 * Policy Gradient Agent (REINFORCE)
 * Learns policy directly through gradient ascent
 */
export class PolicyGradientAgent {
  private policyWeights: Map<string, number[]>;
  private alpha: number;
  private discountedReturn: number;

  constructor(alpha: number = 0.01, numActions: number = 4) {
    this.policyWeights = new Map();
    this.alpha = alpha;
    this.discountedReturn = 0;
  }

  /**
   * Get policy probabilities for a state
   */
  private getPolicyProbs(state: string, numActions: number): number[] {
    if (!this.policyWeights.has(state)) {
      this.policyWeights.set(state, Array(numActions).fill(0));
    }

    const weights = this.policyWeights.get(state)!;
    const maxWeight = Math.max(...weights);
    const shifted = weights.map((w) => Math.exp(w - maxWeight));
    const sum = shifted.reduce((a, b) => a + b, 0);
    return shifted.map((val) => val / (sum || 1));
  }

  /**
   * Select action based on learned policy
   */
  selectAction(state: string, numActions: number): number {
    const probs = this.getPolicyProbs(state, numActions);
    let r = Math.random();
    for (let i = 0; i < probs.length; i++) {
      r -= probs[i];
      if (r <= 0) return i;
    }
    return numActions - 1;
  }

  /**
   * Update policy based on trajectory
   */
  updatePolicy(states: string[], actions: number[], returns: number[]) {
    for (let t = 0; t < states.length; t++) {
      const state = states[t];
      const action = actions[t];
      const G = returns[t]; // Discounted return

      const probs = this.getPolicyProbs(state, 4);
      const weights = this.policyWeights.get(state)!;

      // Policy gradient: w_i += α * G * ∇log(π(a|s))
      for (let i = 0; i < weights.length; i++) {
        const logGradient = (i === action ? 1 : 0) - probs[i];
        weights[i] += this.alpha * G * logGradient;
      }
    }
  }

  getPolicyTable(): { state: string; probabilities: number[] }[] {
    const table: { state: string; probabilities: number[] }[] = [];
    this.policyWeights.forEach((weights, state) => {
      const maxWeight = Math.max(...weights);
      const shifted = weights.map((w) => Math.exp(w - maxWeight));
      const sum = shifted.reduce((a, b) => a + b, 0);
      const probs = shifted.map((val) => val / (sum || 1));
      table.push({ state, probabilities: probs });
    });
    return table;
  }
}

/**
 * Simple CartPole Environment
 * Balance a pole on a cart (simplified 1D version)
 */
export class CartPole {
  private x: number; // Cart position
  private xDot: number; // Cart velocity
  private theta: number; // Pole angle (radians)
  private thetaDot: number; // Pole angular velocity
  private stepCount: number;
  private maxSteps: number;
  private gravity: number = 9.8;
  private massCart: number = 1;
  private massPole: number = 0.1;
  private length: number = 0.5;
  private force: number = 10;
  private dt: number = 0.02;

  constructor(maxSteps: number = 200) {
    this.x = 0;
    this.xDot = 0;
    this.theta = (Math.random() - 0.5) * 0.2;
    this.thetaDot = (Math.random() - 0.5) * 0.2;
    this.stepCount = 0;
    this.maxSteps = maxSteps;
  }

  reset(): State {
    this.x = 0;
    this.xDot = 0;
    this.theta = (Math.random() - 0.5) * 0.2;
    this.thetaDot = (Math.random() - 0.5) * 0.2;
    this.stepCount = 0;
    return this.getState();
  }

  private getState(): State {
    const isTerminal = Math.abs(this.theta) > 0.209 || Math.abs(this.x) > 2.4 || this.stepCount >= this.maxSteps;
    const reward = 1;

    return {
      x: this.x,
      y: this.theta,
      terminal: isTerminal,
      reward,
    };
  }

  /**
   * Apply force and simulate physics
   */
  step(action: number): State {
    if (this.stepCount >= this.maxSteps) {
      return this.getState();
    }

    const force = action === 1 ? this.force : -this.force;
    const cosTheta = Math.cos(this.theta);
    const sinTheta = Math.sin(this.theta);

    const temp =
      (force + this.massPole * this.length * this.thetaDot * this.thetaDot * sinTheta) /
      (this.massCart + this.massPole);
    const thetaAcc =
      (this.gravity * sinTheta - cosTheta * temp) /
      (this.length * (4 / 3 - (this.massPole * cosTheta * cosTheta) / (this.massCart + this.massPole)));
    const xAcc = temp - (this.massPole * this.length * thetaAcc * cosTheta) / (this.massCart + this.massPole);

    this.x += this.xDot * this.dt;
    this.xDot += xAcc * this.dt;
    this.theta += this.thetaDot * this.dt;
    this.thetaDot += thetaAcc * this.dt;

    this.stepCount++;
    return this.getState();
  }

  getState(): State {
    const isTerminal = Math.abs(this.theta) > 0.209 || Math.abs(this.x) > 2.4 || this.stepCount >= this.maxSteps;
    const reward = 1;
    return { x: this.x, y: this.theta, terminal: isTerminal, reward };
  }

  getObservation(): number[] {
    return [this.x, this.xDot, this.theta, this.thetaDot];
  }

  getMaxSteps(): number {
    return this.maxSteps;
  }

  getStepCount(): number {
    return this.stepCount;
  }
}

/**
 * Train an agent and collect episode statistics
 */
export function trainAgent(
  env: GridWorld,
  agent: QLearningAgent,
  episodes: number = 100
): { episodeRewards: number[]; avgRewards: number[] } {
  const episodeRewards: number[] = [];
  const avgRewards: number[] = [];
  let totalReward = 0;

  for (let episode = 0; episode < episodes; episode++) {
    let state = env.reset();
    let episodeReward = 0;

    for (let step = 0; step < 100; step++) {
      const stateKey = `${state.x},${state.y}`;
      const action = agent.selectAction(stateKey, true);

      const nextState = env.step(action);
      const nextStateKey = `${nextState.x},${nextState.y}`;

      agent.update(stateKey, action, nextState.reward, nextStateKey, nextState.terminal);

      episodeReward += nextState.reward;
      state = nextState;

      if (nextState.terminal) break;
    }

    episodeRewards.push(episodeReward);
    totalReward += episodeReward;
    const avgReward = totalReward / (episode + 1);
    avgRewards.push(avgReward);

    if (episode % 10 === 0) {
      agent.decayEpsilon();
    }
  }

  return { episodeRewards, avgRewards };
}
