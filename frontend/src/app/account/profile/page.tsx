'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [changing, setChanging] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setChanging(true);
    try {
      await api.patch('/auth/profile', { currentPassword: pwForm.currentPassword, password: pwForm.newPassword });
      toast.success('Password changed');
      setShowPasswordForm(false);
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-black/10 p-6 md:p-8">
        <h2 className="font-heading text-sm font-medium tracking-[0.05em] uppercase text-black mb-6 pb-4 border-b border-black/5">Profile</h2>
        <div className="grid grid-cols-2 gap-8">
          {[
            { label: 'First Name', value: user?.firstName },
            { label: 'Last Name', value: user?.lastName },
            { label: 'Email', value: user?.email },
            { label: 'Phone', value: user?.phone || 'Not set' },
            { label: 'Role', value: user?.role },
            { label: 'Email Verified', value: user?.isEmailVerified ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-heading text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-2">{label}</p>
              <p className="font-body text-sm text-black font-medium">{value || '—'}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-black/10 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
          <h2 className="font-heading text-sm font-medium tracking-[0.05em] uppercase text-black">Password</h2>
          {!showPasswordForm && (
            <button onClick={() => setShowPasswordForm(true)} className="font-heading text-[10px] font-medium tracking-[0.1em] uppercase text-black hover:opacity-50 transition-opacity">
              Change
            </button>
          )}
        </div>
        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <input
              type="password" required placeholder="CURRENT PASSWORD"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="w-full px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider"
            />
            <input
              type="password" required minLength={8} placeholder="NEW PASSWORD (MIN 8)"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="w-full px-4 py-3 border border-black/10 font-body text-xs focus:outline-none focus:border-black uppercase tracking-wider"
            />
            <div className="flex gap-4 pt-2">
              <button type="button" onClick={() => { setShowPasswordForm(false); setPwForm({ currentPassword: '', newPassword: '' }); }} className="flex-1 px-6 py-3 font-heading text-xs tracking-wider uppercase text-gray-500 hover:text-black border border-transparent">
                Cancel
              </button>
              <button type="submit" disabled={changing} className="flex-1 px-6 py-3 bg-black text-white font-heading text-xs tracking-wider uppercase hover:bg-gray-800 disabled:opacity-50">
                {changing ? 'Changing...' : 'Update'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
