'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { api, formatINR } from '@/lib/api';

export default function AdminProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const res = await api.get('/products', { params: { limit: 100 } });
      return (res.data.data || res.data).products || [];
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-heading font-semibold rounded-xl hover:bg-gray-800 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>
      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 rounded-xl bg-white/30 animate-pulse" />)}</div>
      ) : (
        <div className="glass-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Product</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">SKU</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Price</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Stock</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {(data as any[])?.map((product: any) => (
                  <tr key={product.id} className="border-b border-white/20 hover:bg-white/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-glacier-100/50 overflow-hidden flex-shrink-0">
                          {product.images?.[0] && <Image src={product.images[0].url} alt="" width={40} height={40} className="w-full h-full object-cover" />}
                        </div>
                        <span className="font-body text-sm text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-body text-xs text-gray-500 font-mono">{product.sku}</td>
                    <td className="py-3 px-4 font-heading font-medium text-sm">{formatINR(product.basePrice)}</td>
                    <td className="py-3 px-4 font-body text-sm text-gray-600">{product.totalStock}</td>
                    <td className="py-3 px-4">
                      <span className={`badge text-[10px] ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
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
