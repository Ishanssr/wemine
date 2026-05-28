'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import { api } from '@/lib/api';

export default function AddressesPage() {
  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await api.get('/users/addresses');
      return (res.data.data || res.data) || [];
    },
  });

  const addrs = addresses as any[] | undefined;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-semibold text-lg text-gray-900">Addresses</h2>
        <button className="btn-secondary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> Add Address
        </button>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-32 rounded-2xl bg-white/30 animate-pulse" />)}
        </div>
      ) : !addrs?.length ? (
        <div className="glass-surface rounded-2xl p-10 text-center">
          <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-4" />
          <p className="font-body text-gray-400">No addresses saved</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addrs.map((addr) => (
            <div key={addr.id} className={`glass-surface rounded-2xl p-5 ${addr.isDefault ? 'ring-2 ring-glacier-400' : ''}`}>
              {addr.isDefault && (
                <span className="badge bg-glacier-100 text-glacier-700 text-[10px] mb-2">Default</span>
              )}
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
