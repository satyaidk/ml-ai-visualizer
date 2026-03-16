'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  description?: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', description: 'Overview' },
  { label: 'Neural Networks', href: '/neural-networks', description: 'Forward & backward propagation' },
  { label: 'ML Algorithms', href: '/ml-algorithms', description: 'Gradient descent, clustering, trees' },
  { label: 'Top 8 Algos', href: '/algorithms', description: 'Essential algorithms' },
  { label: 'Transformers', href: '/transformers', description: 'Attention mechanism & architecture' },
  { label: 'RAG Systems', href: '/rag', description: 'Retrieval-augmented generation' },
  { label: 'Playground', href: '/playground', description: 'Interactive experiments' },
  { label: 'Docs', href: '/docs', description: 'Learning guide' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">NN</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">ML Visualizer</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button would go here */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-secondary">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
