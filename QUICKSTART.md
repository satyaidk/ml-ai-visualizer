# Quick Start Guide

Welcome to the Neural Network & ML Visualizer! This guide will help you get up and running quickly.

## Installation (2 minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Open http://localhost:3000 in your browser
```

## First Steps (5 minutes)

### 1. Explore the Home Page
- Visit `http://localhost:3000`
- Read the overview to understand what you'll learn
- Click on any module to dive deeper

### 2. Visit Neural Networks Module
- Go to `/neural-networks`
- Observe the network visualization (nodes and connections)
- Click "Train" to see the network learn
- Adjust the learning rate slider to see how it affects training speed

### 3. Try ML Algorithms
- Go to `/ml-algorithms`
- Switch between tabs (Gradient Descent, K-Means)
- Click "Step" to see the algorithm make one iteration
- Adjust parameters like learning rate or number of clusters

### 4. Explore Transformers
- Go to `/transformers`
- Enter some text in the "Input Text" field
- Switch between visualizations: "Attention Heatmap", "Embedding Space", "Architecture"
- Click "Process Layer" to see tokens flow through the network

### 5. Visit the Playground
- Go to `/playground`
- Select different experiments (Neural Network, Gradient Descent, K-Means)
- Experiment with parameter values
- Observe how visualizations change in real-time

## Learning Paths

### For Beginners (Start Here!)
1. **Home Page** - Get oriented
2. **Neural Networks** - Understand basic concepts
3. **Docs Page** - Read detailed explanations
4. **Playground** - Experiment with Neural Networks
5. **Glossary** - Look up unfamiliar terms

### For Intermediate Learners
1. **ML Algorithms** - Learn about optimization and clustering
2. **Playground** - Compare algorithms side-by-side
3. **Transformers** - Understand modern architectures
4. **Docs** - Deep dive into specific topics

### For Advanced Learners
1. **Modify code** - Change algorithm implementations
2. **Experiment** - Create new visualizations
3. **Extend** - Add new algorithms
4. **Integrate** - Connect with other tools

## Key Concepts (Glossary Shortcuts)

### Neural Networks
- **Neuron**: A computational unit that transforms inputs
- **Layer**: Collection of neurons processing in parallel
- **Forward Pass**: Data flowing through the network
- **Backpropagation**: Learning algorithm using gradients
- **Activation Function**: Non-linearity added to neurons (ReLU, Sigmoid, Tanh)

### ML Algorithms
- **Gradient Descent**: Optimization algorithm (minimizes loss)
- **K-Means**: Clustering algorithm (groups similar data)
- **Loss Function**: Measures prediction error
- **Learning Rate**: Controls speed of optimization

### Transformers
- **Attention**: Mechanism to focus on relevant tokens
- **Embedding**: Dense vector representation
- **Multi-Head**: Multiple attention heads in parallel
- **Transformer Block**: Attention + Feed-Forward + Residuals

## Interactive Features

### Neural Networks
- Adjust network architecture (layer sizes)
- Change activation functions (Sigmoid, ReLU, Tanh)
- Modify learning rate
- Control training speed
- Watch real-time loss decrease

### Gradient Descent
- Visualize optimization on scatter plot
- Adjust learning rate to see convergence speed
- Perform single or multiple steps
- See fitted regression line improve

### K-Means
- Modify number of clusters (2-6)
- Watch centroids move and stabilize
- See points reassign to clusters
- Observe convergence over iterations

### Transformers
- Enter custom text for tokenization
- View attention heatmaps
- See 2D embedding space
- Understand architecture flow

## Common Questions

### "How do I understand the visualizations?"
- **Neural Network**: Circles are neurons, lines are connections. Brighter = more active.
- **ML Canvas**: Points are data, lines show gradients or cluster assignments.
- **Attention**: Colors show which tokens attend to each other (bright = strong attention).

### "What's a good learning rate?"
- **Too high** (>0.1): Unstable, might jump over optima
- **Good** (0.01-0.1): Fast convergence, stable
- **Too low** (<0.001): Very slow convergence

### "Why doesn't my network learn?"
- Check learning rate (too high = divergence, too low = stagnation)
- Network might be too small for the problem
- Try more training iterations (epochs)

### "What do the colors mean?"
- **Purple/Blue**: Primary color for active neurons
- **Pink/Red**: Negative values or high residuals
- **Brighter**: Stronger activation or higher value
- **Dimmer**: Weaker activation or lower value

## Tips for Learning

1. **Start Simple** - Begin with 2D data before 3D
2. **Change One Thing** - Adjust one parameter at a time
3. **Observe Patterns** - Watch what happens over multiple runs
4. **Compare Methods** - Use the playground to compare algorithms
5. **Read Explanations** - Docs and glossary clarify concepts
6. **Experiment Freely** - Try extreme values to understand limits
7. **Take Notes** - Write down observations and insights

## Next Steps

### Deepen Your Understanding
- Read the comprehensive **Docs** page
- Explore the **Glossary** for terminology
- Study the **FAQ** for common questions
- Check the **README** for detailed information

### Experiment More
- Try different network architectures
- Experiment with various learning rates
- Change the number of clusters in K-Means
- Enter different text for transformer processing

### Extend Your Learning
- Modify the code to experiment
- Implement your own algorithms
- Create custom visualizations
- Integrate with other tools

## Troubleshooting

### Visualizations not updating?
- Check browser console for errors (F12)
- Refresh the page
- Clear browser cache

### Performance issues?
- Reduce animation speed (slider)
- Use fewer data points
- Close other browser tabs
- Try a different browser

### Questions about algorithms?
- Check the **Docs** page
- Read the **Glossary** definitions
- Experiment in the **Playground**
- Refer to the **FAQ** section

## Resources

- **Docs**: `/docs` - Detailed explanations
- **Glossary**: `/glossary` - Term definitions
- **Playground**: `/playground` - Interactive experiments
- **README**: Root directory - Full documentation

## Happy Learning!

Explore, experiment, and build your intuition about how neural networks and ML algorithms work through interactive visualization.

**Pro Tip**: The playground is where the real learning happens. Adjust parameters, observe results, and develop deep intuition! 🚀
