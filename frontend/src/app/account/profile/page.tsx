'use client';

import { useAuthStore } from '@/store/auth-store';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-surface rounded-2xl p-6 md:p-8">
      <h2 className="font-heading font-semibold text-lg text-gray-900 mb-6">Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'First Name', value: user?.firstName },
          { label: 'Last Name', value: user?.lastName },
          { label: 'Email', value: user?.email },
          { label: 'Phone', value: user?.phone || 'Not set' },
          { label: 'Role', value: user?.role },
          { label: 'Email Verified', value: user?.isEmailVerified ? 'Yes' : 'No' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="font-body text-xs text-gray-400 mb-1">{label}</p>
            <p className="font-body text-sm text-gray-900">{value || '—'}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
