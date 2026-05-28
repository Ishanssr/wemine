'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api, formatINR } from '@/lib/api';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-glacier-100 text-glacier-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

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
      <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-6">Orders</h1>
      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-white/30 animate-pulse" />)}</div>
      ) : (
        <div className="glass-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Order</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Customer</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Status</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Payment</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Total</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data as any[])?.map((order: any) => (
                  <tr key={order.id} className="border-b border-white/20 hover:bg-white/20 transition-colors">
                    <td className="py-3 px-4 font-body text-sm text-gray-900 font-mono">{order.orderNumber}</td>
                    <td className="py-3 px-4 font-body text-sm text-gray-600">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge text-[10px] ${statusColors[order.status] || 'bg-gray-100'}`}>{order.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge text-[10px] ${order.paymentStatus === 'SUCCESSFUL' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-heading font-medium text-sm">{formatINR(order.total)}</td>
                    <td className="py-3 px-4 font-body text-xs text-gray-500">
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
