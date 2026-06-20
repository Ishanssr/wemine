'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-lg text-gray-900">Addresses</h2>
        {!showForm && !editingId && (
          <button onClick={() => setShowForm(true)} className="btn-secondary text-sm py-2 px-4">
            <Plus className="w-4 h-4" /> Add Address
          </button>
        )}
      </div>

      {(showForm || editingId) && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="glass-surface rounded-2xl p-6 mb-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-sm text-gray-900">
              {editingId ? 'Edit Address' : 'New Address'}
            </span>
            <button type="button" onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First Name" className="input-field" />
            <input required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last Name" className="input-field" />
          </div>
          <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label (Home, Work...)" className="input-field" />
          <input required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="Address Line 1" className="input-field" />
          <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} placeholder="Address Line 2 (optional)" className="input-field" />
          <div className="grid grid-cols-3 gap-3">
            <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="input-field" />
            <input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className="input-field" />
            <input required value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} placeholder="PIN Code" className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className="input-field" />
            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="input-field" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={cancelForm} className="btn-secondary text-sm py-2.5">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-primary text-sm py-2.5">
              {isPending ? 'Saving...' : editingId ? 'Update' : 'Save'}
            </button>
          </div>
        </motion.form>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-32 rounded-2xl bg-white/30 animate-pulse" />)}
        </div>
      ) : !addrList?.length ? (
        <div className="glass-surface rounded-2xl p-10 text-center">
          <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-4" />
          <p className="font-body text-gray-400">No addresses saved</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addrList.map((addr) => (
            <div key={addr.id} className={`glass-surface rounded-2xl p-5 relative group ${addr.isDefault ? 'ring-2 ring-glacier-400' : ''}`}>
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => startEdit(addr)} className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow-sm">
                  <Pencil className="w-3 h-3 text-gray-500" />
                </button>
                <button
                  onClick={() => { if (confirm('Delete this address?')) deleteMutation.mutate(addr.id); }}
                  className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow-sm"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
              {addr.isDefault && (
                <span className="badge bg-glacier-100 text-glacier-700 text-[10px] mb-2">Default</span>
              )}
              {addr.label && <p className="font-body text-[11px] text-gray-400 uppercase tracking-wider mb-1">{addr.label}</p>}
              <p className="font-heading font-semibold text-sm text-gray-900">{addr.firstName} {addr.lastName}</p>
              <p className="font-body text-xs text-gray-500 mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p className="font-body text-xs text-gray-500">{addr.city}, {addr.state} {addr.zipCode}</p>
              {addr.phone && <p className="font-body text-xs text-gray-400 mt-1">Phone: {addr.phone}</p>}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
