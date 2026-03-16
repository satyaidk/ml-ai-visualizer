'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, GitBranch, Users, Grid, BarChart3, Brain } from 'lucide-react';

export default function AlgorithmsPage() {
  const [showChart, setShowChart] = useState(false);
  
  const algorithms = [
    {
      title: 'Linear Regression',
      icon: TrendingUp,
      category: 'Regression',
      description: 'Predicts continuous values by finding the best-fitting line through data points using least squares optimization.',
      formula: 'y = mx + b',
      useCases: ['House price prediction', 'Sales forecasting', 'Trend analysis'],
      color: 'from-blue-500 to-cyan-500',
      colorClass: 'blue'
    },
    {
      title: 'Logistic Regression',
      icon: GitBranch,
      category: 'Classification',
      description: 'Classifies data into binary or multi-class categories using a sigmoid function to produce probabilities.',
      formula: 'P(y=1) = 1 / (1 + e^(-z))',
      useCases: ['Email spam detection', 'Disease diagnosis', 'Customer churn'],
      color: 'from-purple-500 to-pink-500',
      colorClass: 'purple'
    },
    {
      title: 'Decision Trees',
      icon: Brain,
      category: 'Classification',
      description: 'Builds a tree structure by recursively splitting data on features that best separate classes.',
      formula: 'Information Gain = H(Parent) - Σ(|Ci|/|C|)H(Ci)',
      useCases: ['Credit approval', 'Medical diagnosis', 'Feature importance'],
      color: 'from-orange-500 to-red-500',
      colorClass: 'orange'
    },
    {
      title: 'Random Forest',
      icon: Grid,
      category: 'Ensemble',
      description: 'Creates multiple decision trees and averages their predictions for better accuracy and reduced overfitting.',
      formula: 'Prediction = avg(Tree1, Tree2, ...TreeN)',
      useCases: ['Feature selection', 'Regression tasks', 'Classification'],
      color: 'from-green-500 to-emerald-500',
      colorClass: 'green'
    },
    {
      title: 'K-Nearest Neighbor',
      icon: Users,
      category: 'Instance-based',
      description: 'Classifies data by finding the K nearest training examples and using majority voting for prediction.',
      formula: 'Class = mode(Y[k_nearest])',
      useCases: ['Pattern recognition', 'Recommendation systems', 'Image classification'],
      color: 'from-cyan-500 to-blue-500',
      colorClass: 'cyan'
    },
    {
      title: 'Support Vector Machine',
      icon: BarChart3,
      category: 'Classification',
      description: 'Finds the optimal hyperplane that maximizes the margin between different classes in high-dimensional space.',
      formula: 'f(x) = sign(Σ αi*yi*K(xi,x) + b)',
      useCases: ['Text classification', 'Image recognition', 'Bioinformatics'],
      color: 'from-indigo-500 to-purple-500',
      colorClass: 'indigo'
    },
    {
      title: 'K-Means Clustering',
      icon: Grid,
      category: 'Clustering',
      description: 'Partitions data into K clusters by iteratively assigning points to nearest centroids and updating centers.',
      formula: 'J = Σ ||xi - μk||²',
      useCases: ['Customer segmentation', 'Image compression', 'Document clustering'],
      color: 'from-rose-500 to-pink-500',
      colorClass: 'rose'
    },
    {
      title: 'Naive Bayes',
      icon: Brain,
      category: 'Probabilistic',
      description: 'Uses Bayes theorem and assumes feature independence to compute class probabilities efficiently.',
      formula: 'P(C|X) = P(X|C)P(C) / P(X)',
      useCases: ['Text classification', 'Spam filtering', 'Sentiment analysis'],
      color: 'from-teal-500 to-cyan-500',
      colorClass: 'teal'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <section className="mb-16">
          <div className="inline-block mb-4">
            <Badge variant="outline" className="border-primary/50 text-primary">
              Reference Guide
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Top 8 Machine Learning Algorithms
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Understand the fundamental algorithms that power machine learning applications. Each algorithm explained with formulas, use cases, and visual representations.
          </p>
        </section>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {algorithms.map((algo, idx) => {
            const Icon = algo.icon;
            return (
              <Card
                key={idx}
                className="group hover:shadow-lg hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${algo.color}`} />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-2.5 rounded-lg bg-gradient-to-br ${algo.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {algo.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{algo.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-foreground/70">
                    {algo.description}
                  </p>

                  <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Formula</p>
                    <p className="text-sm font-mono text-foreground/80">
                      {algo.formula}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Use Cases</p>
                    <ul className="space-y-1">
                      {algo.useCases.map((useCase, i) => (
                        <li key={i} className="text-xs text-foreground/60 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Algorithm Comparison Section */}
        <section className="mt-20 pt-16 border-t border-border">
          <h2 className="text-3xl font-bold text-foreground mb-8">Comparison Guide</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Algorithm</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Complexity</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Best For</th>
                </tr>
              </thead>
              <tbody>
                {algorithms.map((algo, idx) => (
                  <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{algo.title}</td>
                    <td className="py-3 px-4 text-muted-foreground">{algo.category}</td>
                    <td className="py-3 px-4">
                      {algo.title === 'Linear Regression' && <span className="text-green-400">O(n)</span>}
                      {algo.title === 'Logistic Regression' && <span className="text-green-400">O(n)</span>}
                      {algo.title === 'Decision Trees' && <span className="text-yellow-400">O(n log n)</span>}
                      {algo.title === 'Random Forest' && <span className="text-orange-400">O(n m log n)</span>}
                      {algo.title === 'K-Nearest Neighbor' && <span className="text-red-400">O(n)</span>}
                      {algo.title === 'Support Vector Machine' && <span className="text-orange-400">O(n²-n³)</span>}
                      {algo.title === 'K-Means Clustering' && <span className="text-yellow-400">O(nki)</span>}
                      {algo.title === 'Naive Bayes' && <span className="text-green-400">O(n)</span>}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {algo.useCases[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Visual Reference Chart */}
        <section className="mt-16 pt-16 border-t border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Top 8 Algorithms - Visual Reference</h2>
              <p className="text-foreground/60 text-sm">Essential machine learning algorithms explained with visual representations</p>
            </div>
            <button
              onClick={() => setShowChart(!showChart)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
            >
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </button>
          </div>
          
          {showChart && (
            <div className="bg-card border border-border rounded-lg p-6 overflow-auto">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-kQcCKn7RvO4PxTj74Q67gF4mIadyKs.png"
                alt="Top 8 Machine Learning Algorithms - Linear Regression, Logistic Regression, Decision Trees, Random Forest, K-Nearest Neighbor, Support Vector Machine, K-Means Clustering, Naive Bayes"
                className="w-full max-w-5xl mx-auto rounded-lg bg-white/5"
              />
              <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-foreground/70 text-center">
                  <span className="font-semibold">Source:</span> DataScienceDojo - Top 8 Machine Learning Algorithms Explained
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Tips Section */}
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">When to Use Linear Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70">
                Linear and logistic regression work well for simpler problems with clear relationships and are interpretable.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="text-lg">When to Use Tree-Based Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70">
                Decision trees and random forests handle non-linear relationships and feature interactions well.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-chart-2/5 border-chart-2/20">
            <CardHeader>
              <CardTitle className="text-lg">When to Use Specialized Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/70">
                SVM for complex separations, KNN for local patterns, and Naive Bayes for fast text classification.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
