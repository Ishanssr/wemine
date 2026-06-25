'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api, formatINR } from '@/lib/api';

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

  const quickLinks = [
    { label: 'Coupons', href: '/admin/coupons', desc: 'Discount Codes' },
    { label: 'Banners', href: '/admin/banners', desc: 'Homepage Visuals' },
    { label: 'Blog', href: '/admin/blog', desc: 'Editorial' },
    { label: 'Designs', href: '/admin/designs', desc: 'Community Voting' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mb-12">
        <h1 className="font-heading text-4xl font-medium text-black tracking-tight uppercase">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10 border border-black/10 mb-12">
        {[
          { label: 'Total Users', value: stats?.totalUsers || 0, href: '/admin/users' },
          { label: 'Total Orders', value: stats?.totalOrders || 0, href: '/admin/orders' },
          { label: 'Revenue', value: formatINR(stats?.totalRevenue || 0), href: null },
          { label: 'Products', value: stats?.totalProducts || 0, href: '/admin/products' },
        ].map(({ label, value, href }) => {
          const content = (
            <div className={`bg-cream-50 p-6 md:p-8 h-full transition-colors ${href ? 'hover:bg-white' : ''}`}>
              <p className="font-heading text-3xl md:text-5xl font-medium text-black mb-2">{value}</p>
              <p className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-500">{label}</p>
            </div>
          );

          return href ? (
            <Link key={label} href={href} className="block">
              {content}
            </Link>
          ) : (
            <div key={label}>{content}</div>
          );
        })}
      </div>

      <div className="mb-12">
        <h2 className="font-body text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400 mb-4 border-b border-black/10 pb-2">Quick Management</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ label, href, desc }) => (
            <Link key={label} href={href} className="block group">
              <div className="p-4 border border-black/10 hover:border-black transition-colors bg-white">
                <p className="font-heading text-sm font-medium uppercase tracking-[0.05em] text-black mb-1">{label}</p>
                <p className="font-body text-[10px] text-gray-500 uppercase tracking-wider">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between border-b border-black pb-4 mb-6">
          <h2 className="font-body text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400">Recent Orders</h2>
          <Link href="/admin/orders" className="font-body text-[10px] tracking-[0.1em] uppercase text-black hover:text-gray-500 transition-colors">
            View All →
          </Link>
        </div>
        
        {data?.recentOrders?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-3 pr-4 font-normal">Order</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-3 pr-4 font-normal">Customer</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-3 pr-4 font-normal">Status</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-3 pr-4 font-normal">Total</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-3 font-normal">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b border-black/5 hover:bg-white transition-colors">
                    <td className="py-4 pr-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-body text-xs text-black hover:opacity-50 transition-opacity">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 font-body text-xs text-gray-600">
                      {order.user?.firstName} {order.user?.lastName}
                    </td>
                    <td className="py-4 pr-4">
                      <span className="font-body text-[10px] tracking-[0.1em] uppercase text-black">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 font-heading text-sm">{formatINR(order.total)}</td>
                    <td className="py-4 font-body text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="font-body text-xs text-gray-400 uppercase tracking-widest">No recent orders</p>
        )}
      </div>
    </motion.div>
  );
}
