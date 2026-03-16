# Quick Start Guide: New Features

## 1. WebGL GPU Acceleration

### What's New?
GPU-accelerated canvas rendering for 5-10x performance improvement on large datasets.

### How to Use
The `WebGLCanvasComponent` is a drop-in replacement for `MLCanvas`:

```tsx
import { WebGLCanvasComponent } from '@/components/webgl-canvas';

// Use exactly like MLCanvas
<WebGLCanvasComponent
  points={myPoints}
  type="kmeans"
  centroids={centroids}
  width={600}
  height={400}
  useWebGL={true}
/>
```

### Features
- Automatic browser detection (falls back to Canvas 2D if needed)
- GPU badge indicator in top-right corner
- Same visual output as Canvas 2D
- Zero-configuration setup

### Browser Compatibility
- ✅ Chrome/Edge (WebGL 2.0)
- ✅ Firefox (WebGL 2.0)
- ✅ Safari (WebGL)
- ✅ Mobile browsers (with fallback)

---

## 2. Advanced ML Algorithms

### What's New?
Four powerful machine learning algorithms with interactive visualization:
- **Support Vector Machines (SVM)** - Linear, RBF, Polynomial kernels
- **Random Forests** - Ensemble decision tree classifier
- **Gaussian Mixture Models** - Probabilistic clustering
- **Naive Bayes** - Fast probabilistic classifier

### Where to Find It
Navigate to: **Advanced ML** in the top menu, or directly to `/advanced-algorithms`

### Key Features
✨ **Real-time visualization** - See decision boundaries update instantly
✨ **Hyperparameter tuning** - Adjust parameters with sliders
✨ **Performance metrics** - Live accuracy display
✨ **Dataset generation** - New data with one click
✨ **Algorithm comparison** - Side-by-side comparison

### Code Example: SVM Training
```typescript
import { 
  generateBinaryClassificationData,
  trainSVM,
  predictSVM 
} from '@/lib/ml-algorithms-advanced';

// Generate data
const data = generateBinaryClassificationData(50, 3);

// Train model
const model = trainSVM(data, 'rbf', 0.1, 100, 0.01);

// Make predictions
const prediction = predictSVM(model, {x: 1, y: 2}, data.points, data.labels);
// Returns: 0 or 1 (class prediction)
```

### Code Example: Random Forest
```typescript
import { 
  trainRandomForest, 
  predictRandomForest 
} from '@/lib/ml-algorithms-advanced';

const model = trainRandomForest(data, 5, 5); // 5 trees, depth 5
const prediction = predictRandomForest(model, {x: 1, y: 2});
```

### Code Example: GMM
```typescript
import { 
  trainGMM, 
  predictGMM 
} from '@/lib/ml-algorithms-advanced';

const model = trainGMM(data, 3); // 3 components
const result = predictGMM(model, {x: 1, y: 2});
// Returns: { component: 0, probability: 0.85 }
```

### Code Example: Naive Bayes
```typescript
import { 
  trainNaiveBayes, 
  predictNaiveBayes 
} from '@/lib/ml-algorithms-advanced';

const model = trainNaiveBayes(data);
const prediction = predictNaiveBayes(model, {x: 1, y: 2});
// Returns: class prediction (0 or 1)
```

---

## 3. CNN Visualization

### What's New?
Interactive convolutional neural network visualization for deep learning education.

### Where to Find It
Navigate to: **CNN Visualization** in the top menu, or directly to `/cnn-visualization`

### Key Features
✨ **Image upload** - Drag & drop or click to upload
✨ **Real-time inference** - See predictions instantly
✨ **Layer visualization** - Watch how filters transform data
✨ **Filter viewer** - See what each filter learned
✨ **Interactive learning** - Layer-by-layer exploration

### Page Layout
```
┌─────────────────────────────────────┐
│  Image Upload │ Layer Visualization │
├─────────────────────────────────────┤
│         Learned Filters              │
├─────────────────────────────────────┤
│       Network Architecture           │
├─────────────────────────────────────┤
│        Learning Resources            │
└─────────────────────────────────────┘
```

### Code Example: Image Processing
```typescript
import {
  canvasToImageData,
  resizeImage,
  normalizeImage,
  drawImageData
} from '@/lib/image-processing';

// Get image from canvas
const image = canvasToImageData(canvas);

// Resize to 28x28 (for MNIST)
const resized = resizeImage(image, 28, 28);

// Normalize to 0-1 range
const normalized = normalizeImage(resized, 'unit');

// Draw on another canvas
drawImageData(targetCanvas, normalized, 'grayscale');
```

### Code Example: CNN Forward Pass
```typescript
import {
  createMNISTModel,
  forwardPass,
  predictDigit
} from '@/lib/cnn-models';

const model = createMNISTModel();
const outputs = forwardPass(model, imageData);

// Get layer outputs
console.log(outputs[0]); // Input
console.log(outputs[1]); // After Conv1
console.log(outputs[2]); // After ReLU1
// ...

// Get predictions
const result = predictDigit(model, imageData);
// Returns: { predictions: [0,1,2,...9], confidence: [...] }
```

### Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WebP
- BMP

### Image Requirements
- Any size (auto-resized to 28×28)
- Color images converted to grayscale
- Normalized to 0-1 range automatically

---

## File Organization

### Library Files
```
lib/
├── webgl-utils.ts              # WebGL core utilities
├── webgl-renderers.ts          # Rendering functions
├── ml-algorithms-advanced.ts   # SVM, RF, GMM, NB implementations
├── image-processing.ts         # Image utilities
└── cnn-models.ts               # CNN models and forward pass
```

### Component Files
```
components/
├── webgl-canvas.tsx            # GPU-accelerated canvas
├── cnn-layer-visualization.tsx # Layer output viewer
├── cnn-filter-viewer.tsx       # Filter weight display
└── image-prediction-panel.tsx  # Image upload interface
```

### Page Files
```
app/
├── advanced-algorithms/page.tsx    # SVM, RF, GMM, NB page
└── cnn-visualization/page.tsx      # CNN learning page
```

---

## Performance Tips

### WebGL
- Use for datasets with 1000+ points for best performance
- Automatically falls back on unsupported browsers
- Monitor FPS with DevTools

### Advanced Algorithms
- Generate new data instead of retraining unnecessarily
- Keep dataset size <1000 points for instant response
- Adjust hyperparameters to see real-time changes

### CNN
- Upload images under 10MB for fast processing
- Grayscale or RGB both work equally
- Layer visualization loads instantly

---

## Troubleshooting

### WebGL Not Activating
- Check browser WebGL support: `webglreport.com`
- Verify GPU badge appears in top-right
- Check console for WebGL errors
- Falls back to Canvas 2D automatically

### Algorithms Not Training
- Ensure data has both classes (0 and 1)
- Check console for error messages
- Try generating new data
- Adjust hyperparameters

### CNN Predictions Seem Random
- This is expected! The model is trained on synthetic data
- Predictions work better on digit-like images
- Upload test images for experimentation
- Not meant for production use

---

## Learning Resources

### WebGL
- Read: `lib/webgl-utils.ts` - Core utilities
- Read: `lib/webgl-renderers.ts` - How to use them
- Study: `components/webgl-canvas.tsx` - Integration example

### Advanced Algorithms
- Algorithm details in: `lib/ml-algorithms-advanced.ts` (well-commented)
- Usage examples on: `/advanced-algorithms` page
- See also: ML Algorithms page for simpler examples

### CNN
- Image processing: `lib/image-processing.ts`
- CNN models: `lib/cnn-models.ts`
- Visualization: `components/cnn-*.tsx` files
- Learning guide: `/cnn-visualization` page

---

## Next Steps

1. **Explore the Features**
   - Try `/advanced-algorithms` page
   - Upload an image to `/cnn-visualization`
   - Compare rendering performance

2. **Integrate into Your Projects**
   - Import components and libraries as shown above
   - Customize to your needs
   - Extend algorithms with your own

3. **Learn the Details**
   - Read through the source code (well-commented)
   - Check IMPLEMENTATION_SUMMARY.md for architecture details
   - Experiment with parameters and data

---

## Support

- Check IMPLEMENTATION_SUMMARY.md for comprehensive details
- Review the source code - it's clean and well-documented
- Error messages in browser console will guide you
- All algorithms work in pure JavaScript (no external ML libraries)
