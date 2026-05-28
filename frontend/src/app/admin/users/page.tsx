'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

export default function AdminUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return (res.data.data || res.data).users || [];
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-6">Users</h1>
      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-16 rounded-xl bg-white/30 animate-pulse" />)}</div>
      ) : (
        <div className="glass-surface rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Name</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Email</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Role</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Verified</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Orders</th>
                  <th className="font-body text-xs font-medium text-gray-500 pb-3 px-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(data as any[])?.map((user: any) => (
                  <tr key={user.id} className="border-b border-white/20 hover:bg-white/20 transition-colors">
                    <td className="py-3 px-4 font-body text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-3 px-4 font-body text-sm text-gray-500">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`badge text-[10px] ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-glacier-100 text-glacier-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge text-[10px] ${user.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isEmailVerified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-body text-sm text-gray-600">{user._count?.orders || 0}</td>
                    <td className="py-3 px-4 font-body text-xs text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('en-IN')}
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
