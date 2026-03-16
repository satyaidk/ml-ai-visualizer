'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
}

interface GlossaryProps {
  terms: GlossaryTerm[];
  title?: string;
}

export function Glossary({ terms, title = 'Glossary' }: GlossaryProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {title && <div className="px-6 py-4 border-b border-border bg-secondary/30 font-bold">{title}</div>}
      
      <div className="divide-y divide-border">
        {terms.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            className="w-full text-left px-6 py-4 hover:bg-secondary/30 transition-colors flex items-start justify-between gap-4"
          >
            <div>
              <div className="font-bold text-foreground">{item.term}</div>
              {expandedIndex === idx && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-muted-foreground">{item.definition}</p>
                  {item.example && (
                    <div className="mt-2 p-2 rounded bg-background border border-border">
                      <p className="text-xs font-mono text-foreground">{item.example}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                expandedIndex === idx ? 'rotate-180' : ''
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
