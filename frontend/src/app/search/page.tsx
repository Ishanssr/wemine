'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { api, formatINR } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { useDebounce } from '@/hooks/use-debounce';
import type { Product } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(query, 300);
  const [filters, setFilters] = useState({ category: '', sortBy: 'relevance', minPrice: '', maxPrice: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, filters],
    queryFn: async () => {
      if (!debouncedQuery) return { results: [], suggestions: [] };
      const res = await api.get('/search', { params: { q: debouncedQuery, ...filters } });
      return res.data.data || res.data;
    },
    enabled: !!debouncedQuery,
  });

  const results = data?.results || [];

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-14 pr-12 py-4 bg-white/60 backdrop-blur-sm border border-white/50 rounded-2xl text-gray-900 font-body text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-glacier-300/50 transition-all"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-5 top-1/2 -translate-y-1/2">
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mb-8">
          <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="input-field w-auto text-sm">
            <option value="relevance">Relevance</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
          <input type="number" placeholder="Min ₹" value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="input-field w-24 text-sm" />
          <input type="number" placeholder="Max ₹" value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="input-field w-24 text-sm" />
        </div>

        {data?.suggestions?.length > 0 && query && !isLoading && (
          <div className="mb-8">
            <p className="font-body text-xs text-gray-400 mb-2">Suggestions</p>
            <div className="flex flex-wrap gap-2">
              {data.suggestions.map((s: string) => (
                <button key={s} onClick={() => setQuery(s)}
                  className="px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-lg font-body text-xs text-gray-600 hover:bg-white/60 transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-[4/5] rounded-2xl bg-white/30 animate-pulse" />)}
          </div>
        ) : query && results.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-gray-400">No results for "{query}"</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product: Product, i: number) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-body text-gray-400">Search for your favorite mountain wear</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="pt-28 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-glacier-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
