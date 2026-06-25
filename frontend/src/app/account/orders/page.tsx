'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { api, formatINR } from '@/lib/api';
import type { Order } from '@/types';

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
      <h2 className="font-heading text-sm font-medium tracking-[0.05em] uppercase text-black mb-6 pb-4 border-b border-black/5">Orders</h2>
      {isLoading ? (
        <div className="space-y-px bg-black/10 border border-black/10">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-white animate-pulse" />)}
        </div>
      ) : !orders?.length ? (
        <div className="bg-white border border-black/10 p-10 text-center">
          <p className="font-heading text-[10px] tracking-[0.1em] uppercase text-gray-400">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-px bg-black/10 border border-black/10">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`} className="block bg-white p-6 hover:bg-black/5 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-heading font-medium text-sm text-black">{order.orderNumber}</p>
                  <p className="font-body text-xs text-gray-400 uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className="font-heading text-[10px] tracking-[0.1em] uppercase text-black">
                  {order.status}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {order.items?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 border border-black/10 bg-gray-50 overflow-hidden flex-shrink-0">
                      {item.imageUrl && <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-black font-medium truncate">{item.name}</p>
                      <p className="font-heading text-[10px] tracking-wider text-gray-400 uppercase">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-heading font-medium text-sm text-black">{formatINR(item.total)}</span>
                  </div>
                ))}
                {(order.items?.length || 0) > 3 && (
                  <p className="font-heading text-[10px] tracking-wider uppercase text-gray-400">+{order.items!.length - 3} more items</p>
                )}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <span className="font-heading text-[10px] tracking-wider uppercase text-gray-500">{order.items?.length} items</span>
                <span className="font-heading font-medium text-base text-black">{formatINR(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
