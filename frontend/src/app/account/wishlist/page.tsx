'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, X, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, formatINR } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

export default function WishlistPage() {
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist');
      return (res.data.data || res.data) || [];
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      await api.delete(`/wishlist/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
  });

  const items = wishlist as any[] | undefined;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="font-heading text-sm font-medium tracking-[0.05em] uppercase text-black mb-6 pb-4 border-b border-black/5">Wishlist</h2>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="aspect-[4/5] bg-black/5 animate-pulse" />)}
        </div>
      ) : !items?.length ? (
        <div className="bg-white border border-black/10 p-10 text-center">
          <p className="font-heading text-[10px] tracking-[0.1em] uppercase text-gray-400">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard product={item.product as Product} />
              <button
                onClick={() => removeMutation.mutate(item.product.id)}
                className="absolute top-4 right-4 w-8 h-8 z-10 flex items-center justify-center bg-white border border-black/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
