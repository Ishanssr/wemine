'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api, formatINR } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCouponsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discountValue: '', type: 'PERCENTAGE', minOrderValue: '', expiresAt: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const res = await api.get('/coupons');
      return (res.data.data || res.data) || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/coupons', {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon created');
      setShowForm(false);
      setForm({ code: '', discountValue: '', type: 'PERCENTAGE', minOrderValue: '', expiresAt: '' });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create coupon'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] });
      toast.success('Coupon deleted');
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
        <h1 className="font-heading text-4xl font-medium text-black tracking-tight uppercase">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="font-heading text-[10px] font-medium tracking-[0.1em] uppercase text-black hover:opacity-50 transition-opacity">
          + New Coupon
        </button>
      </div>

      {showForm && (
        <div className="border border-black/10 p-6 mb-8 bg-white">
          <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-4">Create Coupon</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black" placeholder="CODE (e.g. SUMMER20)" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
            <select className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black bg-white" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </select>
            <input type="number" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black" placeholder="Discount Value" value={form.discountValue} onChange={e => setForm({...form, discountValue: e.target.value})} />
            <input type="number" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black" placeholder="Min Order Value (Optional)" value={form.minOrderValue} onChange={e => setForm({...form, minOrderValue: e.target.value})} />
            <input type="datetime-local" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowForm(false)} className="px-6 py-3 font-heading text-xs tracking-wider uppercase text-gray-500 hover:text-black border border-transparent">Cancel</button>
            <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.code || !form.discountValue} className="px-6 py-3 bg-black text-white font-heading text-xs tracking-wider uppercase hover:bg-gray-800 disabled:opacity-50">Create</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-px bg-black/10 border border-black/10">
          {[1, 2].map((i) => <div key={i} className="h-16 bg-white animate-pulse" />)}
        </div>
      ) : (
        <div className="bg-white border border-black/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Code</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Discount</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Min Order</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Status</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                {(!data || data.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center font-body text-xs text-gray-400 uppercase tracking-widest">No coupons found</td>
                  </tr>
                ) : (
                  (data as any[]).map((coupon: any) => (
                    <tr key={coupon.id} className="border-t border-black/5 hover:bg-black/5 transition-colors">
                      <td className="py-4 px-6 font-heading font-medium text-sm text-black">{coupon.code}</td>
                      <td className="py-4 px-6 font-body text-xs text-black">
                        {coupon.type === 'PERCENTAGE' ? `${coupon.discountValue}%` : formatINR(coupon.discountValue)}
                      </td>
                      <td className="py-4 px-6 font-body text-xs text-gray-500">{coupon.minOrderValue ? formatINR(coupon.minOrderValue) : 'None'}</td>
                      <td className="py-4 px-6">
                        <span className="font-body text-[10px] tracking-[0.1em] uppercase text-black">
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button onClick={() => { if(confirm('Delete coupon?')) deleteMutation.mutate(coupon.id); }} className="text-gray-400 hover:text-red-600 transition-colors uppercase text-[10px] tracking-wider font-heading">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
