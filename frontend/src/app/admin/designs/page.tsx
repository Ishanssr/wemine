'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { api } from '@/lib/api';
import { optimizeImage } from '@/lib/images';
import { Plus, Trash2, Star, Upload, Bookmark, DollarSign, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDesignsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [images, setImages] = useState<{ file: File; preview: string; label: string; key: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [prebookPrices, setPrebookPrices] = useState<Record<string, string>>({});
  const [viewingPrebooks, setViewingPrebooks] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['admin-designs'],
    queryFn: async () => {
      const res = await api.get('/admin/designs');
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
    const { data } = await api.post('/upload/image', fd);
    return data.url;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      setUploading(true);
      // Upload all images in parallel
      const uploads = await Promise.all(
        images.map((img) => uploadImage(img.file)),
      );
      const urls: Record<string, string> = { imageUrl: '', imageBack: '', imageModel: '', imageFemaleFront: '', imageFemaleBack: '' };
      images.forEach((img, i) => { urls[img.key] = uploads[i]; });
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

  const prebookMutation = useMutation({
    mutationFn: async ({ id, isPrebook, prebookPrice }: { id: string; isPrebook: boolean; prebookPrice?: number }) => {
      await api.put(`/admin/designs/${id}/prebook`, { isPrebook, prebookPrice });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designs'] });
      toast.success('Prebook status updated');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to update prebook status');
    },
  });

  const convertMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/admin/designs/${id}/convert`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designs'] });
      toast.success('Design converted to product!');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to convert design');
    },
  });

  const handleTogglePrebook = (design: any) => {
    const price = prebookPrices[design.id];
    if (!design.isPrebook && (!price || parseFloat(price) <= 0)) {
      toast.error('Set a prebook price first');
      return;
    }
    prebookMutation.mutate({
      id: design.id,
      isPrebook: !design.isPrebook,
      prebookPrice: design.isPrebook ? undefined : parseFloat(price),
    });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/designs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-designs'] });
      toast.success('Design deleted');
    },
  });

  const { data: prebookUsers } = useQuery({
    queryKey: ['design-prebooks', viewingPrebooks],
    queryFn: async () => {
      if (!viewingPrebooks) return [];
      const res = await api.get(`/admin/designs/${viewingPrebooks}/prebooks`);
      return (res.data || []) as any[];
    },
    enabled: !!viewingPrebooks,
  });

  const imageFields = [
    { key: 'imageUrl', label: 'Male Front' },
    { key: 'imageBack', label: 'Male Back' },
    { key: 'imageFemaleFront', label: 'Female Front' },
    { key: 'imageFemaleBack', label: 'Female Back' },
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
                        className={`aspect-[3/4] w-full relative border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all overflow-hidden ${
                           img ? 'border-black/20' : 'border-black/10 hover:border-black/30'
                         }`}
                      >
                        {img ? (
                          <Image src={img.preview} alt={label} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
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
              <div className="aspect-[3/4] relative overflow-hidden bg-black/5">
                <Image src={design.imageUrl} alt={design.title} fill className="object-cover image-sharp" sizes="(max-width: 768px) 50vw, 25vw" />
                {design.avgRating !== null && (
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span className="font-heading text-xs font-medium">{design.avgRating}</span>
                  </div>
                )}
                {design.isPrebook && (
                  <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur px-2 py-1 flex items-center gap-1">
                    <Bookmark className="w-3 h-3 text-white" />
                    <span className="font-heading text-[10px] font-medium text-white">₹{design.prebookPrice}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="font-heading text-xs font-medium text-gray-900 truncate">{design.title}</p>
                    <p className="font-body text-[10px] text-gray-400">{design.ratingCount || 0} ratings · {design.prebookCount || 0} prebooks</p>
                    {design.prebookCount > 0 && (
                      <button onClick={() => setViewingPrebooks(design.id)} className="text-[10px] font-heading font-medium text-glacier-600 hover:text-glacier-700 transition-colors">
                        View
                      </button>
                    )}
                  </div>
                  <button onClick={() => deleteMutation.mutate(design.id)}
                    className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all flex-shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-1.5">
                  {!design.isPrebook && (
                    <div className="flex items-center gap-1 flex-1">
                      <DollarSign className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <input
                        type="number"
                        placeholder="Price"
                        value={prebookPrices[design.id] || ''}
                        onChange={(e) => setPrebookPrices({ ...prebookPrices, [design.id]: e.target.value })}
                        className="w-full min-w-0 px-2 py-1 text-[10px] font-body border border-black/10 outline-none focus:border-black transition-colors"
                        step="1"
                        min="1"
                      />
                    </div>
                  )}
                  <button
                    onClick={() => handleTogglePrebook(design)}
                    disabled={prebookMutation.isPending}
                    className={`text-[10px] font-heading font-medium tracking-[0.05em] uppercase px-2.5 py-1 border transition-all flex-shrink-0 disabled:opacity-40 ${
                      design.isPrebook
                        ? 'bg-black text-white border-black hover:bg-gray-800'
                        : 'border-black/10 text-gray-500 hover:border-black/30'
                    }`}
                  >
                    {design.isPrebook ? 'Prebook ON' : 'Prebook OFF'}
                  </button>
                  {design.isPrebook && (
                    <button
                      onClick={() => convertMutation.mutate(design.id)}
                      disabled={convertMutation.isPending}
                      className="text-[10px] font-heading font-medium tracking-[0.05em] uppercase px-2.5 py-1 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all flex-shrink-0 disabled:opacity-40"
                    >
                      Convert
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {viewingPrebooks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setViewingPrebooks(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-black/5">
                <h3 className="font-heading text-sm font-medium text-gray-900">Prebooked Users</h3>
                <button onClick={() => setViewingPrebooks(null)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                {!prebookUsers?.length ? (
                  <p className="font-body text-sm text-gray-400 text-center py-8">No prebooks yet</p>
                ) : (
                  <div className="space-y-2">
                    {prebookUsers.map((pb: any) => (
                      <div key={pb.id} className="flex items-center justify-between border border-black/5 p-3">
                        <div>
                          <p className="font-heading text-xs font-medium text-gray-900">
                            {pb.user.firstName || pb.user.email} {pb.user.lastName || ''}
                          </p>
                          <p className="font-body text-[10px] text-gray-400">{pb.user.email}</p>
                        </div>
                        <p className="font-body text-[10px] text-gray-400">
                          {new Date(pb.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
