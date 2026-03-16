'use client';

import React, { useState, useMemo } from 'react';
import { Navigation } from '@/components/navigation';
import { RAGCanvas } from '@/components/rag-canvas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  naiveRAG,
  vectorRAG,
  rerankDocuments,
  multimodalRAG,
  generateRAGResponse,
  sampleDocuments,
  type QueryResult
} from '@/lib/rag';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

const RAG_ARCHITECTURES = [
  {
    id: 'naive',
    name: 'Naive RAG',
    description: 'Simple keyword matching and retrieval based on term overlap',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'vector',
    name: 'Vector RAG',
    description: 'Semantic search using dense vector embeddings for similarity',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'rerank',
    name: 'Retrieve & Rerank',
    description: 'Retrieval followed by reranking for improved relevance',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'multimodal',
    name: 'Multimodal RAG',
    description: 'Combines text embeddings with metadata and structured data',
    color: 'from-green-500 to-emerald-500'
  }
];

export default function RAGPage() {
  const [selectedArchitecture, setSelectedArchitecture] = useState<string>('vector');
  const [query, setQuery] = useState<string>('How do transformers work?');
  const [showArchDiagram, setShowArchDiagram] = useState(false);
  const [showFlowDiagram, setShowFlowDiagram] = useState(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [retrievedDocs, setRetrievedDocs] = useState<QueryResult[]>([]);
  const [response, setResponse] = useState<string>('');

  const performRAG = () => {
    let results: QueryResult[] = [];

    switch (selectedArchitecture) {
      case 'naive':
        results = naiveRAG(query, sampleDocuments, 3);
        break;
      case 'vector':
        results = vectorRAG(query, sampleDocuments, 3);
        break;
      case 'rerank':
        const initial = vectorRAG(query, sampleDocuments, 5);
        results = rerankDocuments(query, initial, 3);
        break;
      case 'multimodal':
        results = multimodalRAG(query, sampleDocuments, 3);
        break;
      default:
        results = vectorRAG(query, sampleDocuments, 3);
    }

    setRetrievedDocs(results);
    const ragResponse = generateRAGResponse(query, results);
    setResponse(ragResponse);
  };

  const animateRAG = async () => {
    setCurrentStep(0);
    setIsRunning(true);

    for (let step = 0; step < 4; step++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (step === 2) {
        performRAG();
      }
      setCurrentStep(step + 1);
    }

    setIsRunning(false);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setRetrievedDocs([]);
    setResponse('');
  };

  const avgRelevance = retrievedDocs.length > 0
    ? (retrievedDocs.reduce((a, d) => a + d.relevance, 0) / retrievedDocs.length * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <section className="mb-12">
          <Badge variant="outline" className="border-primary/50 text-primary mb-4">
            Advanced Topic
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Retrieval-Augmented Generation (RAG)
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Understand how RAG systems combine document retrieval with generative models to produce
            factually grounded responses. Explore different RAG architectures and their tradeoffs.
          </p>
        </section>

        {/* Architecture Selection */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">RAG Architectures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {RAG_ARCHITECTURES.map(arch => (
              <button
                key={arch.id}
                onClick={() => {
                  setSelectedArchitecture(arch.id);
                  resetDemo();
                }}
                className={`text-left p-4 rounded-lg border-2 transition-all ${
                  selectedArchitecture === arch.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <h3 className="font-bold text-foreground mb-1">{arch.name}</h3>
                <p className="text-sm text-muted-foreground">{arch.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="mb-12">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Interactive RAG Demo</CardTitle>
              <CardDescription>
                Enter a query and watch the RAG system retrieve documents and generate a response
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Query Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">
                  Your Query
                </label>
                <div className="flex gap-2">
                  <Input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Ask a question about ML/AI concepts..."
                    disabled={isRunning}
                    className="bg-input border-border"
                  />
                  <Button
                    onClick={animateRAG}
                    disabled={isRunning || !query.trim()}
                    className="gap-2"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Running
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Execute
                      </>
                    )}
                  </Button>
                  {(currentStep > 0 || retrievedDocs.length > 0) && (
                    <Button
                      onClick={resetDemo}
                      variant="outline"
                      className="gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Visualization */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground">
                  RAG Pipeline Visualization
                </label>
                <RAGCanvas
                  query={query}
                  retrievedDocs={retrievedDocs}
                  step={currentStep}
                />
              </div>

              {/* Step Indicator */}
              <div className="flex gap-2 items-center justify-center">
                {['Query', 'Embedding', 'Retrieval', 'Generation'].map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        currentStep > idx
                          ? 'bg-primary text-primary-foreground'
                          : currentStep === idx
                          ? 'bg-primary/50 text-foreground border-2 border-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    {idx < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Results */}
              {retrievedDocs.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-muted/30 border-border">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Documents Retrieved</p>
                        <p className="text-3xl font-bold text-primary">{retrievedDocs.length}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30 border-border">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Avg. Relevance</p>
                        <p className="text-3xl font-bold text-accent">{avgRelevance}%</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-muted/30 border-border">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">Architecture</p>
                        <p className="text-xl font-bold text-foreground">
                          {RAG_ARCHITECTURES.find(a => a.id === selectedArchitecture)?.name}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Retrieved Documents */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Retrieved Documents</h3>
                    {retrievedDocs.map((doc, idx) => (
                      <Card
                        key={idx}
                        className="bg-card border-primary/20 hover:border-primary/50 transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{doc.document.id}</CardTitle>
                              <CardDescription className="text-xs mt-1">
                                {doc.document.metadata?.topic || 'Document'}
                              </CardDescription>
                            </div>
                            <Badge className="bg-primary/20 text-primary">
                              {(doc.relevance * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-foreground/80">{doc.context}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Generated Response */}
                  {response && (
                    <div className="space-y-3 pt-6 border-t border-border">
                      <h3 className="font-semibold text-foreground">Generated Response</h3>
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-6">
                          <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                            {response}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Architecture Details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <div className="w-1 h-6 bg-primary rounded" />
                <div>
                  <p className="font-semibold text-sm">Factually Grounded</p>
                  <p className="text-xs text-muted-foreground">Responses are based on actual documents</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 h-6 bg-accent rounded" />
                <div>
                  <p className="font-semibold text-sm">Reduced Hallucination</p>
                  <p className="text-xs text-muted-foreground">Models generate fewer false facts</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 h-6 bg-chart-2 rounded" />
                <div>
                  <p className="font-semibold text-sm">Up-to-date Knowledge</p>
                  <p className="text-xs text-muted-foreground">Can reference recent documents</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1 h-6 bg-chart-3 rounded" />
                <div>
                  <p className="font-semibold text-sm">Verifiable Sources</p>
                  <p className="text-xs text-muted-foreground">Users can check cited documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Components</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold text-sm text-primary">Retriever</p>
                <p className="text-xs text-muted-foreground">Finds relevant documents from knowledge base using vector search or keyword matching</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-accent">Embeddings Model</p>
                <p className="text-xs text-muted-foreground">Converts text into dense vectors for semantic similarity comparison</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-chart-2">Reranker</p>
                <p className="text-xs text-muted-foreground">Reorders results to improve relevance using cross-encoders</p>
              </div>
              <div>
                <p className="font-semibold text-sm text-chart-3">Generator (LLM)</p>
                <p className="text-xs text-muted-foreground">Produces final answer using retrieved context and prompt engineering</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">RAG Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Customer Support',
                description: 'Retrieve help docs and FAQs to provide accurate support responses'
              },
              {
                title: 'Legal Documents',
                description: 'Search contracts and precedents to generate informed legal advice'
              },
              {
                title: 'Medical QA',
                description: 'Access medical literature to answer health-related questions accurately'
              },
              {
                title: 'Research Assistant',
                description: 'Find relevant papers and citations for academic writing and analysis'
              },
              {
                title: 'Knowledge Base QA',
                description: 'Query internal documentation to answer employee questions'
              },
              {
                title: 'Product Support',
                description: 'Reference product manuals and wikis for technical support'
              }
            ].map((useCase, idx) => (
              <Card key={idx} className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{useCase.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* RAG Architectures Reference */}
        <section className="mt-16 pt-16 border-t border-border">
          <div className="space-y-8">
            {/* RAG Architectures Diagram */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">RAG Architecture Patterns</h2>
                  <p className="text-foreground/60 text-sm">Comprehensive comparison of different RAG implementation approaches</p>
                </div>
                <button
                  onClick={() => setShowArchDiagram(!showArchDiagram)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  {showArchDiagram ? 'Hide Architectures' : 'Show Architectures'}
                </button>
              </div>
              
              {showArchDiagram && (
                <div className="bg-card border border-border rounded-lg p-6 overflow-auto">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Q7rvV7wuZ6yZgDkhXqJ16wXa1t7lyK.png"
                    alt="Retrieval-Augmented Generation Architectures - Naive RAG, Vector RAG, Retrieve-and-Rerank, Multimodal RAG, Graph RAG, Hybrid RAG, Agentic RAG, Multi-Agent RAG"
                    className="w-full max-w-6xl mx-auto rounded-lg bg-white/5"
                  />
                  <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-foreground/70 text-center">
                      <span className="font-semibold">Source:</span> Retrieval-Augmented Generation System Architectures & Patterns
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* GenAI Workflow Diagram */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">AI Process Evolution</h2>
                  <p className="text-foreground/60 text-sm">From traditional ML to GenAI-enabled workflows with monitoring</p>
                </div>
                <button
                  onClick={() => setShowFlowDiagram(!showFlowDiagram)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  {showFlowDiagram ? 'Hide Workflow' : 'Show Workflow'}
                </button>
              </div>
              
              {showFlowDiagram && (
                <div className="bg-card border border-border rounded-lg p-6 overflow-auto">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jIT6t4ylFRmWjKKmpQ44kmWgENXR3p.png"
                    alt="AI Process Evolution - Companies view, Traditional ML workflow with Data Science, and GenAI-enabled process with Workflow Experimentation, Monitoring, Guardrails, and Human in the Loop"
                    className="w-full max-w-5xl mx-auto rounded-lg bg-white/5"
                  />
                  <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-foreground/70 text-center">
                      <span className="font-semibold">Source:</span> Evolution from Traditional ML to GenAI-Enabled Processes
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
