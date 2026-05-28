'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api, formatINR } from '@/lib/api';
import { Package, Users, ShoppingCart, IndianRupee } from 'lucide-react';

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data.data || res.data;
    },
    refetchInterval: 30000,
  });

  const stats = data?.stats;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <p className="font-heading text-xs font-medium text-glacier-600 tracking-[0.2em] uppercase mb-2">Admin</p>
      <h1 className="font-heading text-3xl font-semibold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-400 to-blue-500' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'from-purple-400 to-purple-500' },
          { label: 'Revenue', value: formatINR(stats?.totalRevenue || 0), icon: IndianRupee, color: 'from-green-400 to-green-500' },
          { label: 'Products', value: stats?.totalProducts || 0, icon: Package, color: 'from-glacier-400 to-glacier-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-surface rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="font-heading text-2xl font-semibold text-gray-900">{value}</p>
            <p className="font-body text-xs text-gray-500 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-surface rounded-2xl p-6">
        <h2 className="font-heading font-semibold text-base text-gray-900 mb-4">Recent Orders</h2>
        {data?.recentOrders?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 pr-4">Order</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 pr-4">Customer</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 pr-4">Status</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 pr-4">Total</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order: any, i: number) => (
                  <tr key={order.id} className="border-b border-white/20">
                    <td className="py-3 pr-4 font-body text-sm text-gray-900">{order.orderNumber}</td>
                    <td className="py-3 pr-4 font-body text-sm text-gray-600">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`badge text-[10px] ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                        'bg-glacier-100 text-glacier-700'
                      }`}>{order.status}</span>
                    </td>
                    <td className="py-3 pr-4 font-heading font-medium text-sm">{formatINR(order.total)}</td>
                    <td className="py-3 font-body text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="font-body text-sm text-gray-400">No recent orders</p>
        )}
      </div>
    </motion.div>
  );
}
