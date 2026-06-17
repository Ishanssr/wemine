'use client';

import { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import type { Product } from '@/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, sortBy, category: searchParams.get('category') }],
    queryFn: async () => {
      try {
        const res = await api.get('/products', {
          params: { search, sortBy, category: searchParams.get('category'), limit: 50 },
        });
        return (res.data.data || res.data);
      } catch {
        return { products: MOCK_PRODUCTS };
      }
    },
    retry: 1,
    staleTime: 300000,
  });

  const products: Product[] = data?.products || MOCK_PRODUCTS;

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="font-heading text-xs font-medium text-glacier-600 tracking-[0.2em] uppercase mb-3">
            Collection
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
            Our Products
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary px-4"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-auto"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </motion.div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="glass-surface rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-sm">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="font-body text-xs font-medium text-gray-600 mb-2 block">
                  Min Price
                </label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                  className="input-field"
                  placeholder="₹0"
                />
              </div>
              <div>
                <label className="font-body text-xs font-medium text-gray-600 mb-2 block">
                  Max Price
                </label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="input-field"
                  placeholder="₹10,000"
                />
              </div>
            </div>
          </motion.div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/30 animate-pulse aspect-[4/5]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pt-28 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white/30 animate-pulse aspect-[4/5]" />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
