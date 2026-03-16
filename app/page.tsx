'use client';

import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Brain, Zap, Network, Sparkles } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'Neural Networks',
      description: 'Forward propagation, backpropagation, activation functions, and weight optimization.',
      href: '/neural-networks',
      tag: 'Fundamental',
      color: 'from-primary to-primary/50',
    },
    {
      icon: Zap,
      title: 'ML Algorithms',
      description: 'Gradient descent, K-means, decision trees, and core learning algorithms.',
      href: '/ml-algorithms',
      tag: 'Core',
      color: 'from-accent to-accent/50',
    },
    {
      icon: Network,
      title: 'Top 8 Algorithms',
      description: 'Linear regression, logistic regression, SVM, clustering, ensemble methods.',
      href: '/algorithms',
      tag: 'Reference',
      color: 'from-chart-1 to-chart-1/50',
    },
    {
      icon: Sparkles,
      title: 'Transformers',
      description: 'Attention mechanisms, positional encoding, multi-head attention, encoder-decoder.',
      href: '/transformers',
      tag: 'Advanced',
      color: 'from-chart-2 to-chart-2/50',
    },
    {
      icon: Network,
      title: 'RAG Systems',
      description: 'Retrieval-augmented generation, embeddings, vector search, multi-agent RAG.',
      href: '/rag',
      tag: 'Modern',
      color: 'from-chart-3 to-chart-3/50',
    },
    {
      icon: Sparkles,
      title: 'Playground',
      description: 'Experiment with all models and algorithms with interactive controls.',
      href: '/playground',
      tag: 'Practice',
      color: 'from-chart-5 to-chart-5/50',
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
              <span className="text-sm font-medium text-primary">Visual Learning Platform</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Understand AI & ML Visually
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Interactive visualizations of neural networks, machine learning algorithms, and transformer architecture. Learn how data flows through models with animated diagrams, real-time computations, and step-by-step explanations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/neural-networks"
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/playground"
              className="px-8 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary/10 transition-colors"
            >
              Try Playground
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Learning Modules</h2>
          <p className="text-muted-foreground mb-12">Explore interactive visualizations of AI and ML concepts</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group relative overflow-hidden rounded-lg p-6 bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${feature.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-primary/70 bg-primary/10 px-2.5 py-1 rounded-full">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Why Visual Learning?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Interactive Controls',
                description: 'Adjust parameters in real-time and see how models respond instantly with animated visualizations.',
              },
              {
                title: 'Data Flow Visualization',
                description: 'Watch data move through each layer, see transformations, activations, and computations happen live.',
              },
              {
                title: 'Step-by-Step Learning',
                description: 'Pause, play, and step through each iteration to understand exactly how models learn and process information.',
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-lg bg-background border border-border">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            Built with React, Next.js, and Tailwind CSS. Learn AI and ML through interactive visualization.
          </p>
        </div>
      </footer>
    </main>
  );
}
