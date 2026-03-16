# ML & AI Visualizer - Complete Learning Platform

An interactive web application for understanding neural networks, machine learning algorithms, transformer architecture, and retrieval-augmented generation systems through visual representations and real-time simulations.

## Features

### 🧠 Neural Networks Module
- **Interactive visualization** of neural network architecture with real-time forward propagation
- **Configurable networks** - adjust layer sizes, activation functions, and learning rates
- **Training simulation** - watch the network learn to solve the XOR problem
- **Backpropagation visualization** - see how errors propagate backward through layers
- **Parameter controls** - experiment with different configurations and observe effects

### 📊 Machine Learning Algorithms
- **Gradient Descent** - visualize optimization of linear regression models
- **K-Means Clustering** - see how points are grouped into clusters
- **Decision Trees** - explore tree-based classification (coming soon)
- **Real-time visualization** - watch algorithms converge in action
- **Adjustable parameters** - modify learning rates, number of clusters, etc.

### ⚡ Transformer Architecture
- **Attention Heatmap** - visualize how tokens attend to each other
- **Embedding Space** - see token embeddings in 2D projection
- **Architecture Flow** - understand the complete transformer pipeline
- **Token Processing** - input text and see step-by-step processing
- **Multi-Head Attention** - explore parallel attention mechanisms

### 🔍 RAG Systems (Retrieval-Augmented Generation)
- **Multiple RAG Architectures** - Naive RAG, Vector RAG, Retrieve & Rerank, Multimodal RAG
- **Document Retrieval** - semantic search through vector embeddings
- **Relevance Scoring** - visualize retrieval confidence and ranking
- **Response Generation** - see how context grounds the final response
- **Interactive Pipeline** - step through each RAG stage with real documents
- **Architecture Comparison** - understand tradeoffs between different RAG approaches

### 📌 Top 8 ML Algorithms
- **Visual Algorithm Cards** - clear explanations of essential algorithms
- **Comparison Table** - complexity analysis and use case mapping
- **Implementation Details** - formulas and parameter explanations
- **Real-world Applications** - practical use cases for each algorithm
- **Category Organization** - regression, classification, clustering, probabilistic

### 🎮 Interactive Playground
- **Multi-algorithm environment** - experiment with all models in one place
- **Real-time parameter adjustment** - see immediate effects
- **Comparative learning** - understand relationships between algorithms
- **Step-through execution** - pause and step through computations

### 📚 Learning Resources
- **Comprehensive documentation** - detailed explanations of all concepts
- **Interactive glossary** - expandable definitions of key terms
- **Best practices** - tips for effective model training
- **FAQ section** - answers to common questions

## Technology Stack

- **Framework**: Next.js 16+ with React 19
- **Styling**: Tailwind CSS with custom design tokens
- **Visualization**: Canvas API for rendering
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## Getting Started

### Installation

```bash
# Clone or download the project
cd neural-network-visualizer

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Running the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
/app
  /neural-networks          # Neural network visualization page
  /ml-algorithms           # ML algorithms visualization page
  /algorithms              # Top 8 algorithms reference page
  /transformers           # Transformer architecture page
  /rag                    # RAG systems visualization page
  /playground             # Interactive playground
  /docs                   # Learning documentation
  /glossary               # Term definitions
  page.tsx                # Home page

/components
  navigation.tsx          # Main navigation bar
  neural-network-canvas.tsx    # NN visualization canvas
  ml-canvas.tsx           # ML algorithms canvas
  transformer-canvas.tsx  # Transformer visualization
  rag-canvas.tsx          # RAG pipeline visualization
  glossary.tsx           # Glossary component

/lib
  neural-network.ts       # NN utilities and algorithms
  ml-algorithms.ts        # ML algorithm implementations
  transformers.ts         # Transformer implementation
  rag.ts                  # RAG implementations and utilities
```

## Modules Overview

### Neural Networks
Learn how artificial neurons connect and learn through backpropagation.

**Key Features:**
- Forward propagation visualization
- Backpropagation learning
- Multiple activation functions (Sigmoid, ReLU, Tanh)
- Real-time weight updates
- XOR problem training example

### ML Algorithms
Explore fundamental machine learning algorithms.

**Currently Implemented:**
- Gradient Descent for linear regression
- K-Means unsupervised clustering
- Coming soon: Decision trees, SVM, etc.

### Transformers
Understand the architecture behind modern language models.

**Key Components:**
- Token embedding visualization
- Positional encoding
- Multi-head attention mechanism
- Feed-forward networks
- Residual connections
- Layer normalization

### Playground
Experiment with all concepts in one interactive environment.

**Features:**
- Switch between different models
- Adjust parameters in real-time
- See immediate effects on visualizations
- Compare behavior across algorithms

## Learning Paths

### Beginner
1. Start at the **Home** page for overview
2. Visit **Neural Networks** to understand basic concepts
3. Explore **ML Algorithms** for fundamental techniques
4. Read **Docs** for detailed explanations

### Intermediate
1. Review **Glossary** for terminology
2. Experiment in the **Playground**
3. Study **Transformers** architecture
4. Adjust parameters and observe behaviors

### Advanced
1. Modify the code to experiment with variations
2. Combine learnings across modules
3. Implement your own algorithms
4. Extend the visualizations

## Key Concepts Explained

### Neural Networks
- **Neurons**: Units that compute weighted sum of inputs + bias through activation
- **Layers**: Groups of neurons; input → hidden → output
- **Forward Pass**: Data flows through network to produce predictions
- **Backpropagation**: Algorithm to compute gradients and update weights
- **Activation Functions**: Add non-linearity (Sigmoid, ReLU, Tanh)

### Gradient Descent
- **Optimization algorithm** that minimizes loss
- Computes **gradients** (direction of steepest descent)
- Updates parameters in **opposite direction** of gradient
- **Learning rate** controls step size
- Converges to local (or global) minima

### K-Means Clustering
- **Unsupervised learning** - no labels needed
- Initialize **k centroids** randomly
- **Assign** each point to nearest centroid
- **Update** centroids as mean of assigned points
- Repeat until convergence

### Transformers
- **Self-attention**: Tokens attend to all tokens in sequence
- **Multi-head attention**: Multiple parallel attention mechanisms
- **Positional encoding**: Encodes sequence position information
- **Feed-forward**: Small neural network per token
- **Residual connections**: Skip connections for deep networks

### RAG Systems
- **Retriever**: Finds relevant documents using semantic search
- **Embeddings**: Converts documents to dense vectors for similarity
- **Reranking**: Improves result ordering using relevance models
- **Generator**: LLM produces answer using retrieved context
- **Knowledge Base**: Organized collection of documents
- **Pipeline**: Query → Embedding → Retrieval → Reranking → Generation

## Customization

### Adjusting Colors
Edit `/app/globals.css` to modify the design tokens:

```css
.dark {
  --primary: oklch(0.65 0.25 280);      /* Purple/blue accent */
  --background: oklch(0.065 0 0);       /* Near black */
  --foreground: oklch(0.97 0 0);        /* Near white */
  /* ... more tokens ... */
}
```

### Adding New Visualizations
1. Create new utility functions in `/lib`
2. Create new canvas component in `/components`
3. Create new page in `/app`
4. Add navigation link in `components/navigation.tsx`

### Implementing New Algorithms
1. Add algorithm logic to `/lib/ml-algorithms.ts` (or new file)
2. Create visualization component
3. Create page with controls and explanations
4. Test with interactive playground

## Performance Tips

- **Canvas rendering** is optimized for real-time updates
- **Avoid** computing all frames at full detail
- **Use** memoization for expensive calculations
- **Profile** with Chrome DevTools for bottlenecks

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (touch support)

## Educational Use

This application is designed for:
- Students learning ML and AI
- Educators teaching these concepts
- Practitioners building intuition
- Researchers prototyping ideas

Feel free to use, modify, and distribute for educational purposes.

## Future Enhancements

- [ ] GPU acceleration with WebGL
- [ ] More ML algorithms (SVM, Random Forests, etc.)
- [ ] CNN visualization with image data
- [ ] RNN/LSTM sequence modeling
- [ ] Reinforcement learning environments
- [ ] Export/import network configurations
- [ ] Save training progress
- [ ] Collaborative learning sessions
- [ ] Mobile-optimized layouts
- [ ] Accessibility improvements

## Contributing

This is an educational project. If you have suggestions or improvements, consider:
- Creating issues for bugs or feature requests
- Submitting PRs for enhancements
- Sharing feedback and use cases
- Improving documentation

## License

This project is provided as-is for educational purposes.

## Credits

Built with:
- Next.js - React framework
- Tailwind CSS - Styling
- shadcn/ui - UI components
- Canvas API - Visualizations

## Support

For issues or questions:
1. Check the **Docs** and **Glossary** pages
2. Review the **FAQ** section
3. Experiment in the **Playground**
4. Check browser console for errors

---

**Happy Learning!** 🚀

Explore, experiment, and build your understanding of neural networks, machine learning, and transformers through interactive visualization.
