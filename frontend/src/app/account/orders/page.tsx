'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { api, formatINR } from '@/lib/api';
import type { Order } from '@/types';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-glacier-100 text-glacier-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

export default function OrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await api.get('/orders');
      return (res.data.data || res.data).orders || [];
    },
  });

  const orders = data as Order[] | undefined;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="font-heading font-semibold text-lg text-gray-900 mb-6">Orders</h2>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-2xl bg-white/30 animate-pulse" />)}
        </div>
      ) : !orders?.length ? (
        <div className="glass-surface rounded-2xl p-10 text-center">
          <p className="font-body text-gray-400">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="block glass-surface rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-heading font-semibold text-sm text-gray-900">{order.orderNumber}</p>
                  <p className="font-body text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-glacier-100/50 overflow-hidden flex-shrink-0">
                      {item.imageUrl && <Image src={item.imageUrl} alt="" width={40} height={40} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="font-body text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-heading font-medium text-sm">{formatINR(item.total)}</span>
                  </div>
                ))}
                {(order.items?.length || 0) > 3 && (
                  <p className="font-body text-xs text-gray-400">+{order.items!.length - 3} more items</p>
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/40">
                <span className="font-body text-sm text-gray-500">{order.items?.length} items</span>
                <span className="font-heading font-semibold text-base">{formatINR(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
