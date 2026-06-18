'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

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
  const [search, setSearch] = useState('');

  const { data: designs, isLoading } = useQuery({
    queryKey: ['designs', 'products-page'],
    queryFn: async () => {
      try {
        const res = await api.get('/designs');
        return (res.data.designs || []) as any[];
      } catch {
        return [];
      }
    },
    staleTime: 300000,
  });

  const filtered = useMemo(() => {
    const items = (designs || []).map(designToProduct);
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((p) => p.name.toLowerCase().includes(q));
  }, [designs, search]);

  const isEmpty = !isLoading && filtered.length === 0;

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
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search designs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11"
            />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white/30 animate-pulse aspect-[4/5]" />
            ))}
          </div>
        ) : isEmpty && !search ? (
          <div className="text-center py-20">
            <p className="font-heading text-xl font-medium text-gray-900 mb-2">
              Launching Soon
            </p>
            <p className="font-body text-sm text-gray-400">
              No designs yet. Check back soon!
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-gray-400">No designs match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return <ProductsContent />;
}
