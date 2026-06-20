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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-surface rounded-2xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-semibold text-lg text-gray-900">Password</h2>
          {!showPasswordForm && (
            <button onClick={() => setShowPasswordForm(true)} className="font-body text-xs text-gray-500 hover:text-gray-900 underline transition-colors">
              Change
            </button>
          )}
        </div>
        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-sm">
            <input
              type="password" required placeholder="Current password"
              value={pwForm.currentPassword}
              onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              className="input-field"
            />
            <input
              type="password" required minLength={8} placeholder="New password (min. 8 chars)"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              className="input-field"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => { setShowPasswordForm(false); setPwForm({ currentPassword: '', newPassword: '' }); }} className="btn-secondary text-sm py-2.5">
                Cancel
              </button>
              <button type="submit" disabled={changing} className="btn-primary text-sm py-2.5">
                {changing ? 'Changing...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
