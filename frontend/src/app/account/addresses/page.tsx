'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Pencil, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface Address {
  id: string;
  label?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

const emptyForm = {
  label: '', firstName: '', lastName: '', phone: '',
  line1: '', line2: '', city: '', state: '',
  zipCode: '', country: 'India',
};

export default function AddressesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get('/users/addresses');
      return (res.data.data || res.data) as Address[];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/users/addresses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setShowForm(false);
      setForm(emptyForm);
      toast.success('Address added');
    },
    onError: () => toast.error('Failed to add address'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof form }) => api.patch(`/users/addresses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setEditingId(null);
      setForm(emptyForm);
      toast.success('Address updated');
    },
    onError: () => toast.error('Failed to update address'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/addresses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted');
    },
    onError: () => toast.error('Failed to delete address'),
  });

  const startEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label || '',
      firstName: addr.firstName,
      lastName: addr.lastName,
      phone: addr.phone || '',
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: addr.country,
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const addrList = addresses as Address[] | undefined;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-end justify-between mb-8 border-b border-black pb-4">
        <h2 className="font-heading text-sm font-medium tracking-[0.05em] uppercase text-black">Addresses</h2>
        {!showForm && !editingId && (
          <button onClick={() => setShowForm(true)} className="font-heading text-[10px] font-medium tracking-[0.1em] uppercase text-black hover:opacity-50 transition-opacity">
            + Add Address
          </button>
        )}
      </div>

      {(showForm || editingId) && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="bg-white border border-black/10 p-6 md:p-8 mb-8 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-4">
            <span className="font-heading text-xs tracking-[0.05em] uppercase text-black font-medium">
              {editingId ? 'Edit Address' : 'New Address'}
            </span>
            <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-black transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="FIRST NAME" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
            <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="LAST NAME" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
          </div>
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="LABEL (HOME, WORK...)" className="w-full px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
          <input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="ADDRESS LINE 1" className="w-full px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
          <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} placeholder="ADDRESS LINE 2 (OPTIONAL)" className="w-full px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
          <div className="grid grid-cols-3 gap-4">
            <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="CITY" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
            <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="STATE" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
            <input required value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} placeholder="PIN CODE" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="PHONE (OPTIONAL)" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="COUNTRY" className="px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={cancelForm} className="px-6 py-3 font-heading text-xs tracking-wider uppercase text-gray-500 hover:text-black border border-transparent transition-colors">Cancel</button>
            <button type="submit" disabled={isPending} className="px-6 py-3 bg-black text-white font-heading text-xs tracking-wider uppercase hover:bg-gray-800 disabled:opacity-50 transition-colors">
              {isPending ? 'Saving...' : editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </motion.form>
      )}

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="h-32 bg-black/5 animate-pulse" />)}
        </div>
      ) : !addrList?.length ? (
        <div className="bg-white border border-black/10 p-10 text-center">
          <p className="font-heading text-[10px] tracking-[0.1em] uppercase text-gray-400">No addresses saved</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addrList.map((addr) => (
            <div key={addr.id} className={`bg-white border p-6 relative group transition-colors ${addr.isDefault ? 'border-black' : 'border-black/10 hover:border-black/30'}`}>
              <div className="absolute top-4 right-4 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(addr)} className="text-gray-400 hover:text-black transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm('Delete this address?')) deleteMutation.mutate(addr.id); }}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {addr.isDefault && (
                <span className="font-heading text-[10px] tracking-[0.1em] uppercase text-black mb-3 block">Default Address</span>
              )}
              {addr.label && <p className="font-heading text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-2">{addr.label}</p>}
              <p className="font-body text-sm font-medium text-black">{addr.firstName} {addr.lastName}</p>
              <p className="font-body text-xs text-gray-500 mt-2 leading-relaxed">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p className="font-body text-xs text-gray-500 leading-relaxed">{addr.city}, {addr.state} {addr.zipCode}</p>
              {addr.phone && <p className="font-heading text-[10px] tracking-wider uppercase text-gray-400 mt-3">Phone: {addr.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
