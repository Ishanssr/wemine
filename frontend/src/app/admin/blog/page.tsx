'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', content: '', coverImage: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: async () => {
      const res = await api.get('/blog');
      return (res.data.data || res.data) || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/blog', form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      toast.success('Blog post created');
      setShowForm(false);
      setForm({ title: '', slug: '', content: '', coverImage: '' });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create post'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/blog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'blog'] });
      toast.success('Post deleted');
    },
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
        <h1 className="font-heading text-4xl font-medium text-black tracking-tight uppercase">Blog</h1>
        <button onClick={() => setShowForm(!showForm)} className="font-heading text-[10px] font-medium tracking-[0.1em] uppercase text-black hover:opacity-50 transition-opacity">
          + New Post
        </button>
      </div>

      {showForm && (
        <div className="border border-black/10 p-6 mb-8 bg-white">
          <h3 className="font-heading text-sm tracking-[0.05em] uppercase mb-4">Create Post</h3>
          <div className="flex flex-col gap-4 mb-4">
            <input className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <input className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black" placeholder="Slug (e.g. my-first-post)" value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} />
            <input className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black" placeholder="Cover Image URL" value={form.coverImage} onChange={e => setForm({...form, coverImage: e.target.value})} />
            <textarea className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black min-h-[150px]" placeholder="Content (Markdown supported)" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          </div>
          <div className="flex gap-4">
            <button onClick={() => setShowForm(false)} className="px-6 py-3 font-heading text-xs tracking-wider uppercase text-gray-500 hover:text-black border border-transparent">Cancel</button>
            <button onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !form.title || !form.content} className="px-6 py-3 bg-black text-white font-heading text-xs tracking-wider uppercase hover:bg-gray-800 disabled:opacity-50">Publish</button>
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
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Post</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Date</th>
                  <th className="font-body text-[10px] tracking-[0.1em] uppercase text-gray-400 pb-4 px-6 pt-6 font-normal">Action</th>
                </tr>
              </thead>
              <tbody>
                {(!data || data.length === 0) ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center font-body text-xs text-gray-400 uppercase tracking-widest">No posts found</td>
                  </tr>
                ) : (
                  (data as any[]).map((post: any) => (
                    <tr key={post.id} className="border-t border-black/5 hover:bg-black/5 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-heading font-medium text-sm text-black">{post.title}</p>
                        <p className="font-body text-xs text-gray-500">/{post.slug}</p>
                      </td>
                      <td className="py-4 px-6 font-body text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <button onClick={() => { if(confirm('Delete post?')) deleteMutation.mutate(post.id); }} className="text-gray-400 hover:text-red-600 transition-colors uppercase text-[10px] tracking-wider font-heading">Delete</button>
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
