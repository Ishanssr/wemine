'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Plus, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDesignsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '', category: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-designs'],
    queryFn: async () => {
      const res = await api.get('/designs?limit=50');
      return (res.data.designs || []);
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/designs', form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designs'] });
      toast.success('Design uploaded!');
      setShowForm(false);
      setForm({ title: '', description: '', imageUrl: '', category: '' });
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create design'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/designs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designs'] });
      toast.success('Design deleted');
    },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-heading font-semibold text-lg text-gray-900">Designs</h2>
          <p className="font-body text-sm text-gray-400">Upload and manage community designs</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm px-5 py-2.5">
          <Plus className="w-4 h-4" /> New Design
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden mb-8">
          <div className="border border-black/10 p-6 space-y-4">
            <h3 className="font-heading text-sm tracking-[0.05em] uppercase">Upload Design</h3>
            <input className="input-field" placeholder="Title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="input-field" placeholder="Description (optional)" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="input-field" placeholder="Image URL" value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            <input className="input-field" placeholder="Category (e.g. T-Shirt, Hoodie)" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
              <button onClick={() => createMutation.mutate()} disabled={!form.title || !form.imageUrl || createMutation.isPending}
                className="btn-primary text-sm">
                {createMutation.isPending ? 'Uploading...' : 'Upload Design'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-black/5 animate-pulse" />)}
        </div>
      ) : !data?.length ? (
        <div className="text-center py-16 border border-black/5">
          <p className="font-body text-gray-400">No designs yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((design: any) => (
            <div key={design.id} className="group relative">
              <div className="aspect-[3/4] overflow-hidden bg-black/5">
                <img src={design.imageUrl} alt={design.title} className="w-full h-full object-cover" />
                {design.avgRating !== null && (
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span className="font-heading text-xs font-medium">{design.avgRating}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 flex items-start justify-between">
                <div className="min-w-0">
                  <p className="font-heading text-xs font-medium text-gray-900 truncate">{design.title}</p>
                  <p className="font-body text-[10px] text-gray-400">{design.ratingCount || 0} ratings</p>
                </div>
                <button onClick={() => deleteMutation.mutate(design.id)}
                  className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
