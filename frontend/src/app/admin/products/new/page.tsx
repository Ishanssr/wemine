'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, Plus, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { api } from '@/lib/api';

interface VariantInput {
  name: string;
  size: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    shortDesc: '',
    basePrice: '',
    comparePrice: '',
    sku: '',
    tags: '',
    totalStock: '',
    isActive: true,
    isFeatured: false,
    categoryIds: [] as string[],
  });

  const [variants, setVariants] = useState<VariantInput[]>([
    { name: '', size: '', price: 0, stock: 0, isActive: true },
  ]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => {
      setCategories((data.data || data).categories || data || []);
    });
  }, []);

  const addVariant = () => {
    setVariants((prev) => [...prev, { name: '', size: '', price: 0, stock: 0, isActive: true }]);
  };

  const removeVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx: number, field: keyof VariantInput, value: any) => {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected]);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrls: { url: string }[] = [];

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append('files', f));
        const { data: uploadData } = await api.post('/upload/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrls = (Array.isArray(uploadData) ? uploadData : []).map((u: any, idx: number) => ({
          url: u.url,
          isPrimary: idx === 0,
        }));
      }

      const payload: any = {
        name: form.name,
        description: form.description,
        shortDesc: form.shortDesc || undefined,
        basePrice: parseFloat(form.basePrice),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
        sku: form.sku,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        totalStock: parseInt(form.totalStock) || 0,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
      };

      if (imageUrls.length > 0) payload.images = imageUrls;
      if (form.categoryIds.length > 0) payload.categories = form.categoryIds;
      if (variants.some((v) => v.name || v.size)) {
        payload.variants = variants
          .filter((v) => v.name || v.size)
          .map((v) => ({
            name: v.name,
            size: v.size || undefined,
            price: v.price || undefined,
            stock: v.stock,
            isActive: v.isActive,
          }));
      }

      await api.post('/products', payload);
      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-gray-900">New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
        <section className="glass-surface rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-semibold text-base text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Name</label>
              <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="col-span-2">
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Description</label>
              <textarea className="input-field min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="col-span-2">
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Short Description</label>
              <textarea className="input-field min-h-[60px]" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">SKU</label>
              <input className="input-field" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Tags (comma separated)</label>
              <input className="input-field" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. cotton, summer, limited" />
            </div>
          </div>
        </section>

        <section className="glass-surface rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-semibold text-base text-gray-900">Pricing & Stock</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Base Price (₹)</label>
              <input className="input-field" type="number" step="0.01" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} required />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Compare Price (₹)</label>
              <input className="input-field" type="number" step="0.01" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Total Stock</label>
              <input className="input-field" type="number" value={form.totalStock} onChange={(e) => setForm({ ...form, totalStock: e.target.value })} />
            </div>
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                <span className="font-body text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4" />
                <span className="font-body text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>
        </section>

        <section className="glass-surface rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-semibold text-base text-gray-900">Categories</h2>
          {categories.length === 0 ? (
            <p className="font-body text-sm text-gray-400">No categories found. Create categories first.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: any) => (
                <label key={cat.id} className={`px-3 py-1.5 rounded-xl text-sm font-body cursor-pointer transition-all ${
                  form.categoryIds.includes(cat.id) ? 'bg-black text-white' : 'bg-white/50 text-gray-600 hover:bg-white/80'
                }`}>
                  <input type="checkbox" className="sr-only" checked={form.categoryIds.includes(cat.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, categoryIds: [...form.categoryIds, cat.id] });
                      } else {
                        setForm({ ...form, categoryIds: form.categoryIds.filter((id) => id !== cat.id) });
                      }
                    }}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="glass-surface rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-semibold text-base text-gray-900">Images</h2>
          <div className="flex flex-wrap gap-3">
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden bg-glacier-100/50 group">
                <Image src={src} alt={`Product image ${idx + 1}`} fill className="object-cover" sizes="96px" />
                <button type="button" onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                {idx === 0 && <span className="absolute bottom-1 left-1 text-[8px] font-heading font-semibold bg-black/60 text-white px-1.5 py-0.5 rounded">Primary</span>}
              </div>
            ))}
            <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] font-body text-gray-400 mt-1">Upload</span>
              <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            </label>
          </div>
        </section>

        <section className="glass-surface rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-base text-gray-900">Variants</h2>
            <button type="button" onClick={addVariant}
              className="flex items-center gap-1.5 text-xs font-heading font-semibold text-glacier-700 bg-glacier-100 px-3 py-1.5 rounded-lg hover:bg-glacier-200 transition-all"
            >
              <Plus className="w-3 h-3" /> Add Variant
            </button>
          </div>
          {variants.map((v, idx) => (
            <div key={idx} className="flex items-end gap-3 p-3 bg-white/30 rounded-xl">
              <div className="flex-1">
                <label className="font-body text-[10px] font-medium text-gray-500 mb-0.5 block">Name</label>
                <input className="input-field text-sm" value={v.name} onChange={(e) => updateVariant(idx, 'name', e.target.value)} placeholder="e.g. Small" />
              </div>
              <div className="flex-1">
                <label className="font-body text-[10px] font-medium text-gray-500 mb-0.5 block">Size</label>
                <input className="input-field text-sm" value={v.size} onChange={(e) => updateVariant(idx, 'size', e.target.value)} placeholder="e.g. M" />
              </div>
              <div className="w-24">
                <label className="font-body text-[10px] font-medium text-gray-500 mb-0.5 block">Price</label>
                <input className="input-field text-sm" type="number" value={v.price} onChange={(e) => updateVariant(idx, 'price', parseFloat(e.target.value) || 0)} />
              </div>
              <div className="w-20">
                <label className="font-body text-[10px] font-medium text-gray-500 mb-0.5 block">Stock</label>
                <input className="input-field text-sm" type="number" value={v.stock} onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value) || 0)} />
              </div>
              {variants.length > 1 && (
                <button type="button" onClick={() => removeVariant(idx)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </section>

        <div className="flex items-center gap-3 pb-12">
          <button type="submit" disabled={submitting}
            className="px-6 py-3 bg-black text-white font-heading font-semibold text-sm rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create Product'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-3 font-body text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
