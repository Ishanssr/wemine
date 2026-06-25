'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

export default function AdminUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const res = await api.get('/admin/users?limit=200');
      return (res.data.data || res.data).users || [];
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
        <h1 className="font-heading text-4xl font-medium text-black tracking-tight uppercase">Users</h1>
      </div>

      {isLoading ? (
        <div className="space-y-px bg-black/10 border border-black/10">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-white animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white border border-black/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Name</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Email</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Role</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Verified</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Orders</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(data as any[])?.map((user: any) => (
                  <tr key={user.id} className="border-t border-black/5 hover:bg-black/5 transition-colors">
                    <td className="py-4 px-6 font-body text-xs text-black font-medium">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-4 px-6 font-body text-xs text-gray-500">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className="font-body text-[10px] tracking-[0.1em] uppercase text-black">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-body text-[10px] tracking-[0.1em] uppercase text-black">
                        {user.isEmailVerified ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-heading text-sm text-black">{user._count?.orders || 0}</td>
                    <td className="py-4 px-6 font-body text-xs text-gray-400">
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
