'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { optimizeImage } from '@/lib/images';
import { Plus, Trash2, Star, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDesignsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [images, setImages] = useState<{ file: File; preview: string; label: string; key: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['admin-designs'],
    queryFn: async () => {
      const res = await api.get('/designs');
      return (res.data.designs || []);
    },
  });

  const handleImageSelect = (key: string, label: string) => {
    const input = fileInputRefs.current[key];
    if (input) input.click();
  };

  const onFileChange = (key: string, label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImages((prev) => {
      const filtered = prev.filter((i) => i.key !== key);
      return [...filtered, { file, preview: URL.createObjectURL(file), label, key }];
    });
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('/upload/image', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      const urls: Record<string, string> = { imageUrl: '', imageBack: '', imageModel: '' };
      for (const img of images) {
        const url = await uploadImage(img.file);
        urls[img.key] = url;
      }
      await api.post('/designs', {
        title: form.title,
        description: form.description,
        category: form.category,
        ...urls,
      });
      setUploading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designs'] });
      toast.success('Design uploaded!');
      setShowForm(false);
      setForm({ title: '', description: '', category: '' });
      setImages([]);
    },
    onError: (err: any) => {
      setUploading(false);
      toast.error(err?.response?.data?.message || 'Failed to create design');
    },
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

  const imageFields = [
    { key: 'imageUrl', label: 'Front View' },
    { key: 'imageBack', label: 'Back View' },
    { key: 'imageModel', label: 'On Model' },
  ];

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
            <input className="input-field" placeholder="Category (e.g. T-Shirt, Hoodie)" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} />

            {/* 3 image uploads */}
            <div>
              <p className="font-heading text-xs tracking-[0.05em] uppercase text-gray-500 mb-3">Design Images</p>
              <div className="grid grid-cols-3 gap-3">
                {imageFields.map(({ key, label }) => {
                  const img = images.find((i) => i.key === key);
                  return (
                    <div key={key}>
                      <input
                        ref={(el) => { fileInputRefs.current[key] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onFileChange(key, label, e)}
                      />
                      <button
                        type="button"
                        onClick={() => handleImageSelect(key, label)}
                        className={`aspect-[3/4] w-full border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all overflow-hidden ${
                          img ? 'border-black/20' : 'border-black/10 hover:border-black/30'
                        }`}
                      >
                        {img ? (
                          <img src={img.preview} alt={label} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-gray-300" />
                            <span className="font-body text-[10px] text-gray-400">{label}</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setImages([]); }} className="btn-secondary text-sm">Cancel</button>
              <button
                onClick={() => createMutation.mutate()}
                disabled={!form.title || images.length === 0 || uploading || createMutation.isPending}
                className="btn-primary text-sm"
              >
                {uploading ? 'Uploading images...' : createMutation.isPending ? 'Creating...' : 'Upload Design'}
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
                <img src={optimizeImage(design.imageUrl, 400)} alt={design.title} className="w-full h-full object-cover" />
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
