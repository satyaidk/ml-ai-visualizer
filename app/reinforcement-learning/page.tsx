'use client';

import { useState, useEffect } from 'react';
import { GridWorld, QLearningAgent, trainAgent } from '@/lib/rl-environments';

export default function ReinforcementLearningPage() {
  const [gridSize, setGridSize] = useState(5);
  const [environment, setEnvironment] = useState<GridWorld | null>(null);
  const [agent, setAgent] = useState<QLearningAgent | null>(null);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [episodeRewards, setEpisodeRewards] = useState<number[]>([]);
  const [avgRewards, setAvgRewards] = useState<number[]>([]);
  const [currentPath, setCurrentPath] = useState<[number, number][]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainedEpisodes, setTrainedEpisodes] = useState(0);

  // Initialize environment
  useEffect(() => {
    const newEnv = new GridWorld(gridSize, 50);
    const newAgent = new QLearningAgent(0.1, 0.95, 0.1, 4);

    setEnvironment(newEnv);
    setAgent(newAgent);
    setTrainingComplete(false);
    setTrainedEpisodes(0);
  }, [gridSize]);

  // Train agent
  const handleTrainAgent = async () => {
    if (!environment || !agent) return;

    setIsTraining(true);
    // Simulate training in steps to show progress
    for (let batch = 0; batch < 10; batch++) {
      const { episodeRewards: rewards, avgRewards: avgs } = trainAgent(environment, agent, 10);
      setEpisodeRewards((prev) => [...prev, ...rewards]);
      setAvgRewards((prev) => [...prev, ...avgs]);
      setTrainedEpisodes((prev) => prev + 10);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    setIsTraining(false);
    setTrainingComplete(true);
  };

  // Run trained agent
  const handleRunAgent = () => {
    if (!environment || !agent) return;

    const path: [number, number][] = [];
    let state = environment.reset();
    path.push([state.x, state.y]);

    for (let step = 0; step < 100; step++) {
      const stateKey = `${state.x},${state.y}`;
      const action = agent.selectAction(stateKey, false); // No exploration
      state = environment.step(action);
      path.push([state.x, state.y]);

      if (state.terminal) break;
    }

    setCurrentPath(path);
  };

  const grid = environment?.getGrid();

  return (
    <main className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Reinforcement Learning & Decision Making</h1>
          <p className="text-muted-foreground max-w-2xl">
            Train an agent to navigate a grid world using Q-Learning. Watch it learn to find the shortest path to the goal.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 bg-card p-6 rounded-lg border border-border">
          <div>
            <label className="text-sm font-medium">Grid Size: {gridSize}×{gridSize}</label>
            <input
              type="range"
              min="3"
              max="8"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              disabled={isTraining}
              className="w-full mt-2"
            />
          </div>
          <div className="flex gap-3 items-end">
            <button
              onClick={handleTrainAgent}
              disabled={isTraining || trainingComplete}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {isTraining ? `Training... (${trainedEpisodes}/100)` : trainingComplete ? 'Training Complete' : 'Train Agent'}
            </button>
            <button
              onClick={handleRunAgent}
              disabled={!trainingComplete}
              className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50"
            >
              Run Agent
            </button>
          </div>
        </div>

        {/* Main Grid Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Grid World */}
          <div className="lg:col-span-2 bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold mb-4">Grid World Environment</h2>
            <div className="bg-secondary rounded-lg p-4 inline-block">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridSize}, 30px)` }}>
                {grid &&
                  Array.from({ length: gridSize }).map((_, y) =>
                    Array.from({ length: gridSize }).map((_, x) => {
                      const isGoal = x === grid.goal[0] && y === grid.goal[1];
                      const isAgent = x === grid.agent[0] && y === grid.agent[1];
                      const isObstacle = grid.obstacles.some((obs) => obs[0] === x && obs[1] === y);
                      const isPath = currentPath.some((p) => p[0] === x && p[1] === y);

                      return (
                        <div
                          key={`${x}-${y}`}
                          className="w-8 h-8 rounded-sm border border-border/50 flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: isGoal
                              ? 'rgb(34, 197, 94)'
                              : isAgent
                                ? 'rgb(59, 130, 246)'
                                : isObstacle
                                  ? 'rgb(107, 114, 128)'
                                  : isPath
                                    ? 'rgb(168, 85, 247)'
                                    : 'transparent',
                          }}
                        >
                          {isGoal && '🎯'}
                          {isAgent && '🤖'}
                          {isObstacle && '🚫'}
                        </div>
                      );
                    })
                  )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              🎯 Goal | 🤖 Agent | 🚫 Obstacles | 🟣 Path (from last run)
            </p>
          </div>

          {/* Stats */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-bold mb-4">Training Stats</h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-muted-foreground">Episodes Trained</div>
                <div className="font-semibold text-lg">{trainedEpisodes}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Best Path Length</div>
                <div className="font-semibold text-lg">{currentPath.length || '-'}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <div className={`font-semibold ${trainingComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                  {isTraining ? 'Training...' : trainingComplete ? 'Ready' : 'Not Started'}
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Q-Learning:</strong> Agent learns by trying actions and remembering which lead to rewards.
              </p>
            </div>
          </div>
        </div>

        {/* Reward Graph */}
        {avgRewards.length > 0 && (
          <div className="bg-card p-6 rounded-lg border border-border mb-8">
            <h2 className="text-lg font-bold mb-4">Learning Progress (Average Reward)</h2>
            <div className="bg-secondary/50 rounded-lg p-4 h-64">
              <svg className="w-full h-full" viewBox={`0 0 ${Math.max(avgRewards.length * 10, 100)} 200`}>
                {/* Grid lines */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <line
                    key={`hgrid-${i}`}
                    x1="0"
                    y1={(i / 4) * 200}
                    x2={Math.max(avgRewards.length * 10, 100)}
                    y2={(i / 4) * 200}
                    stroke="currentColor"
                    strokeOpacity="0.1"
                    strokeWidth="1"
                  />
                ))}

                {/* Reward line */}
                {avgRewards.length > 1 && (
                  <polyline
                    points={avgRewards
                      .map((reward, i) => {
                        const x = i * 10;
                        const y = 200 - Math.max(0, Math.min(1, reward)) * 200;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    className="text-primary"
                  />
                )}

                {/* Data points */}
                {avgRewards.map((reward, i) => (
                  <circle
                    key={`point-${i}`}
                    cx={i * 10}
                    cy={200 - Math.max(0, Math.min(1, reward)) * 200}
                    r="2"
                    fill="currentColor"
                    className="text-primary"
                  />
                ))}
              </svg>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Average reward per episode increases as the agent learns better policies
            </p>
          </div>
        )}

        {/* Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold mb-3">How Q-Learning Works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Agent interacts with environment, receives rewards</li>
              <li>• Updates Q-table: Q(s,a) ← Q(s,a) + α[r + γ·max(Q(s',a')) - Q(s,a)]</li>
              <li>• Gradually learns which actions lead to rewards</li>
              <li>• Trades exploration vs exploitation with epsilon-greedy</li>
            </ul>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold mb-3">Environment Details</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Grid size: {gridSize}×{gridSize}</li>
              <li>• Goal: Bottom-right corner</li>
              <li>• 4 actions: Up, Right, Down, Left</li>
              <li>• Obstacles: {grid?.obstacles.length || 0} random walls</li>
              <li>• Max steps: 50 per episode</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
