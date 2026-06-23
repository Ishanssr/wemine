'use client';

import { useState, useMemo, Suspense, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

const CATEGORIES = [
  { label: 'All', value: '' },
  { label: 'T-Shirts', value: 'T-Shirt' },
  { label: 'Hoodies', value: 'Hoodie' },
  { label: 'Jackets', value: 'Jacket' },
  { label: 'Accessories', value: 'Accessories' },
];

function designToProduct(d: any): Product {
  const id = `design-${d.id}`;
  return {
    id,
    name: d.title,
    slug: id,
    description: d.description || '',
    shortDesc: d.description || '',
    basePrice: 0,
    sku: id,
    isActive: true,
    isFeatured: false,
    comingSoon: false,
    isPrebook: d.isPrebook || false,
    prebookPrice: d.prebookPrice || undefined,
    tags: d.category ? [d.category] : [],
    totalStock: 0,
    avgRating: d.avgRating || 0,
    reviewCount: d.ratingCount || 0,
    images: [{ id: `${id}-img`, url: d.imageUrl, altText: d.title, isPrimary: true, sortOrder: 0 }],
    variants: [],
    categories: [{ category: { id: '', name: d.category || '', slug: d.category || '' } }],
    reviews: [],
  };
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    return () => {
      if (window.scrollY > 0) sessionStorage.setItem('products_scroll', String(window.scrollY));
    };
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('products_scroll');
    if (saved) {
      sessionStorage.removeItem('products_scroll');
      requestAnimationFrame(() => window.scrollTo(0, parseInt(saved, 10)));
    }
  }, []);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const { data: designs, isLoading } = useQuery({
    queryKey: ['designs', 'products-page', activeCategory],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        const qs = params.toString();
        const res = await api.get(`/designs${qs ? `?${qs}` : ''}`);
        return (res.data.designs || []) as any[];
      } catch {
        return [];
      }
    },
    staleTime: 300000,
  });

  const filtered = useMemo(() => {
    const items = (designs || []).map(designToProduct);
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [designs, searchQuery]);

  const isEmpty = !isLoading && filtered.length === 0;

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ''}`);
    },
    [router, pathname, searchParams],
  );

  const handleCategoryChange = useCallback(
    (value: string) => updateParams({ category: value }),
    [updateParams],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputValue(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => updateParams({ search: value }), 300);
    },
    [updateParams],
  );

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-gray-900 mb-3">
            Our Collection
          </h1>
          <p className="font-body text-sm text-gray-400 mb-6 max-w-lg">
            Browse our collection of premium apparel.
          </p>
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            {CATEGORIES.map((cat) => {
              const isActive = cat.value === activeCategory;
              return (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryChange(cat.value)}
                  className={`px-4 py-1.5 text-sm font-body rounded-full border transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search designs..."
              value={inputValue}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="input-field pl-11"
            />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-white/30 mb-3" />
                <div className="space-y-1.5 px-1">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty && !searchQuery ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 0 2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128m0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
            </svg>
            <p className="font-heading text-xl font-medium text-gray-900 mb-2">
              Launching Soon
            </p>
            <p className="font-body text-sm text-gray-400">
              No designs yet. Check back soon!
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto mb-6 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <p className="font-body text-gray-400">No designs match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} priority={i < 4} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsPageFallback() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10">
          <div className="h-10 w-64 bg-gray-100 rounded mb-3 animate-pulse" />
          <div className="h-4 w-96 bg-gray-100 rounded mb-6 animate-pulse" />
          <div className="flex flex-wrap items-center gap-1.5 mb-6">
            {CATEGORIES.map((cat) => (
              <div key={cat.value} className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="h-10 max-w-md bg-gray-100 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] rounded-2xl bg-white/30 mb-3" />
              <div className="space-y-1.5 px-1">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
