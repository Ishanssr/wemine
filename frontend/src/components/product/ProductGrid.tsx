'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProductCard } from './ProductCard';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import type { Product } from '@/types';

export function ProductGrid() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      try {
        const res = await api.get('/products', { params: { featured: true, limit: 8 } });
        return (res.data.data || res.data).products || [];
      } catch {
        return MOCK_PRODUCTS.filter((p) => p.isFeatured);
      }
    },
    retry: 1,
    staleTime: 300000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/30 animate-pulse aspect-[4/5]" />
        ))}
      </div>
    );
  }

  const products = (data as Product[]) || (isError ? MOCK_PRODUCTS.filter((p) => p.isFeatured) : []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.slice(0, 8).map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
