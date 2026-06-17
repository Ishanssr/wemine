'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProductCard } from './ProductCard';
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
    comingSoon: true,
    tags: d.category ? [d.category] : [],
    totalStock: 0,
    avgRating: d.avgRating || 0,
    reviewCount: d.ratingCount || 0,
    images: [{ id: `${id}-img`, url: d.imageUrl, altText: d.title, isPrimary: true, sortOrder: 0 }],
    variants: [],
    categories: [],
    reviews: [],
  };
}

export function ProductGrid() {
  const productsQuery = useQuery({
    queryKey: ['products', 'featured-grid'],
    queryFn: async () => {
      try {
        const res = await api.get('/products', { params: { featured: true, limit: 12 } });
        return ((res.data.data || res.data).products || []) as Product[];
      } catch {
        return [] as Product[];
      }
    },
    retry: 1,
    staleTime: 300000,
  });

  const designsQuery = useQuery({
    queryKey: ['designs'],
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

  const isLoading = productsQuery.isLoading || designsQuery.isLoading;

  const products = [...(productsQuery.data || []), ...(designsQuery.data || []).map(designToProduct)];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] bg-gray-100 mb-3" />
            <div className="space-y-1.5">
              <div className="h-3 bg-gray-100 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
      {products.slice(0, 8).map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
