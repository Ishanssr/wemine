'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { api, formatINR } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { limit: 100 } });
      return (res.data.data || res.data).products || [];
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
        <h1 className="font-heading text-4xl font-medium text-black tracking-tight uppercase">Products</h1>
        <Link
          href="/admin/products/new"
          className="font-heading text-[10px] font-medium tracking-[0.1em] uppercase text-black hover:opacity-50 transition-opacity"
        >
          + Add Product
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-px bg-black/10 border border-black/10">
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 bg-white animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white border border-black/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Product</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">SKU</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Price</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Stock</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Status</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data as any[])?.map((product: any) => (
                  <tr key={product.id} className="border-t border-black/5 hover:bg-black/5 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 border border-black/10 bg-gray-50 overflow-hidden flex-shrink-0">
                          {product.images?.[0] && <Image src={product.images[0].url} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />}
                        </div>
                        <Link href={`/admin/products/${product.id}`} className="font-body text-xs text-black font-medium hover:opacity-50 transition-opacity">
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-body text-xs text-gray-500 font-mono">{product.sku}</td>
                    <td className="py-4 px-6 font-heading font-medium text-sm text-black">{formatINR(product.basePrice)}</td>
                    <td className="py-4 px-6 font-body text-xs text-black">{product.totalStock}</td>
                    <td className="py-4 px-6">
                      <span className="font-body text-[10px] tracking-[0.1em] uppercase text-black">
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product.id); }}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
