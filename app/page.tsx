'use client';

import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { ArrowRight, Brain, Zap, Network, Sparkles, Zap as Lightning, BarChart3 } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: 'Neural Networks',
      description: 'See how neural networks learn by adjusting weights. Watch data flow through layers with real-time animations.',
      href: '/neural-networks',
      tag: 'Start Here',
      color: 'from-primary to-primary/50',
    },
    {
      icon: Zap,
      title: 'ML Basics',
      description: 'Learn fundamental algorithms like regression, clustering, and decision trees with visual examples.',
      href: '/ml-algorithms',
      tag: 'Foundations',
      color: 'from-accent to-accent/50',
    },
    {
      icon: BarChart3,
      title: 'Vision & Images',
      description: 'Understand how convolutional networks see and process images with layer-by-layer visualizations.',
      href: '/cnn-visualization',
      tag: 'Images',
      color: 'from-chart-1 to-chart-1/50',
    },
    {
      icon: Lightning,
      title: 'Sequences & Time',
      description: 'Explore RNN and LSTM models that learn from sequences like text, time series, and language.',
      href: '/rnn-lstm',
      tag: 'Sequences',
      color: 'from-chart-2 to-chart-2/50',
    },
    {
      icon: BarChart3,
      title: 'Learning & Decisions',
      description: 'Watch agents learn to make optimal decisions by interacting with environments using reinforcement learning.',
      href: '/reinforcement-learning',
      tag: 'Interactive',
      color: 'from-chart-3 to-chart-3/50',
    },
    {
      icon: Sparkles,
      title: 'Advanced Topics',
      description: 'Deep dive into SVM, Random Forests, Transformers, and modern architectures with detailed explanations.',
      href: '/advanced-algorithms',
      tag: 'Advanced',
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
          <h2 className="text-3xl font-bold mb-3">Learning Paths</h2>
          <p className="text-muted-foreground mb-12">Start with basics or jump to advanced topics. Each module has interactive visualizations and step-by-step explanations.</p>

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
