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
      <h2 className="font-heading font-semibold text-lg text-gray-900 mb-6">Wishlist</h2>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="aspect-[4/5] rounded-2xl bg-white/30 animate-pulse" />)}
        </div>
      ) : !items?.length ? (
        <div className="glass-surface rounded-2xl p-10 text-center">
          <Heart className="w-10 h-10 text-gray-200 mx-auto mb-4" />
          <p className="font-body text-gray-400">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <ProductCard product={item.product as Product} />
              <button
                onClick={() => removeMutation.mutate(item.product.id)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
