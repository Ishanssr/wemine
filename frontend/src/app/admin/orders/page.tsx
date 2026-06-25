'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api, formatINR } from '@/lib/api';

export default function AdminOrdersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const res = await api.get('/admin/orders');
      return (res.data.data || res.data).orders || [];
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
        <h1 className="font-heading text-4xl font-medium text-black tracking-tight uppercase">Orders</h1>
      </div>

      {isLoading ? (
        <div className="space-y-px bg-black/10 border border-black/10">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white border border-black/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Order</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Customer</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Status</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Payment</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Total</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data as any[])?.map((order: any) => (
                  <tr key={order.id} className="border-t border-black/5 hover:bg-black/5 transition-colors">
                    <td className="py-4 px-6 font-body text-xs text-black font-medium">{order.orderNumber}</td>
                    <td className="py-4 px-6 font-body text-xs text-gray-600">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-body text-[10px] tracking-[0.1em] uppercase text-black">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-body text-[10px] tracking-[0.1em] uppercase text-black">
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-heading font-medium text-sm text-black">{formatINR(order.total)}</td>
                    <td className="py-4 px-6 font-body text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
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
