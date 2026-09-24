'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api';
import { Product } from '../../types';
import { formatCurrency } from '../../lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(query)}&limit=6`);
        if (res.data?.success) {
          setResults(res.data.data || []);
        }
      } catch (error) {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (slug: string) => {
    onClose();
    router.push(`/product/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-slide-up">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="relative flex items-center border-b border-zinc-100 dark:border-zinc-800 px-4">
          <Search className="w-5 h-5 text-zinc-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, or collections..."
            className="w-full py-4 text-base bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          {isLoading && <Loader2 className="w-5 h-5 text-zinc-400 animate-spin mr-2" />}
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Suggestions / Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {!query.trim() ? (
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3 px-2">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2 px-2">
                {['Overcoat', 'ANC Headphones', 'Chelsea Boots', 'Leather Bag', 'Cashmere', 'Ceramic Pour-Over'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {results.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                      <Image
                        src={product.images[0]?.url || 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=200&q=80'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                        {product.name}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {typeof product.category === 'object' ? product.category.name : 'Category'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="pt-3 px-2">
                <button
                  onClick={handleSubmit}
                  className="w-full text-center py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 flex items-center justify-center gap-1.5"
                >
                  View all results for &quot;{query}&quot; <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : !isLoading ? (
            <div className="text-center py-8">
              <p className="text-sm text-zinc-500">No products found matching &quot;{query}&quot;</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
