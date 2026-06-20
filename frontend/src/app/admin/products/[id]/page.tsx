'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

interface VariantInput {
  name: string;
  size: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', shortDesc: '',
    basePrice: '', comparePrice: '', sku: '', tags: '',
    totalStock: '', isActive: true, isFeatured: false,
  });
  const [variants, setVariants] = useState<VariantInput[]>([]);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return (res.data.data || res.data) as any;
    },
    retry: false,
  });

  useEffect(() => {
    if (!product) return;
    setForm({
      name: product.name || '',
      description: product.description || '',
      shortDesc: product.shortDesc || '',
      basePrice: String(product.basePrice || ''),
      comparePrice: product.comparePrice ? String(product.comparePrice) : '',
      sku: product.sku || '',
      tags: (product.tags || []).join(', '),
      totalStock: String(product.totalStock || ''),
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? false,
    });
    if (product.variants?.length) {
      setVariants(product.variants.map((v: any) => ({
        name: v.name || '',
        size: v.size || '',
        price: v.price || 0,
        stock: v.stock || 0,
        isActive: v.isActive ?? true,
      })));
    }
  }, [product]);

  const addVariant = () => {
    setVariants((prev) => [...prev, { name: '', size: '', price: 0, stock: 0, isActive: true }]);
  };

  const removeVariant = (idx: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateVariant = (idx: number, field: keyof VariantInput, value: any) => {
    setVariants((prev) => prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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

      if (variants.some((v) => v.name || v.size)) {
        payload.variants = variants
          .filter((v) => v.name || v.size)
          .map((v) => ({ name: v.name, size: v.size || undefined, price: v.price || undefined, stock: v.stock, isActive: v.isActive }));
      }

      await api.put(`/products/${id}`, payload);
      toast.success('Product updated');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-white/30 rounded-lg animate-pulse" />
        <div className="h-96 rounded-2xl bg-white/30 animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-10"><p className="font-body text-gray-400">Product not found</p></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => router.back()} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-gray-900">Edit Product</h1>
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
              <textarea className="input-field resize-none" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Short Description</label>
              <textarea className="input-field resize-none" rows={2} value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">SKU</label>
              <input className="input-field" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Tags (comma separated)</label>
              <input className="input-field" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
          </div>
        </section>

        <section className="glass-surface rounded-2xl p-6 space-y-4">
          <h2 className="font-heading font-semibold text-base text-gray-900">Pricing & Stock</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Base Price (₹)</label>
              <input type="number" min="0" step="0.01" className="input-field" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} required />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Compare Price (₹)</label>
              <input type="number" min="0" step="0.01" className="input-field" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-500 mb-1 block">Total Stock</label>
              <input type="number" min="0" className="input-field" value={form.totalStock} onChange={(e) => setForm({ ...form, totalStock: e.target.value })} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
              <span className="font-body text-xs text-gray-600">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4" />
              <span className="font-body text-xs text-gray-600">Featured</span>
            </label>
          </div>
        </section>

        <section className="glass-surface rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-base text-gray-900">Variants</h2>
            <button type="button" onClick={addVariant} className="btn-secondary text-xs py-1.5 px-3">+ Add Variant</button>
          </div>
          {variants.map((v, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-3 items-end p-3 bg-white/30 rounded-xl">
              <div>
                <label className="font-body text-[10px] text-gray-400 mb-0.5 block">Name</label>
                <input className="input-field text-sm" value={v.name} onChange={(e) => updateVariant(idx, 'name', e.target.value)} />
              </div>
              <div>
                <label className="font-body text-[10px] text-gray-400 mb-0.5 block">Size</label>
                <input className="input-field text-sm" value={v.size} onChange={(e) => updateVariant(idx, 'size', e.target.value)} />
              </div>
              <div>
                <label className="font-body text-[10px] text-gray-400 mb-0.5 block">Price</label>
                <input type="number" min="0" className="input-field text-sm" value={v.price} onChange={(e) => updateVariant(idx, 'price', parseFloat(e.target.value) || 0)} />
              </div>
              <div>
                <label className="font-body text-[10px] text-gray-400 mb-0.5 block">Stock</label>
                <input type="number" min="0" className="input-field text-sm" value={v.stock} onChange={(e) => updateVariant(idx, 'stock', parseInt(e.target.value) || 0)} />
              </div>
              <button type="button" onClick={() => removeVariant(idx)} className="text-red-400 hover:text-red-600 text-xs pb-2">Remove</button>
            </div>
          ))}
        </section>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
