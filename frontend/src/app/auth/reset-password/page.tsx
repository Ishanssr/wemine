'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) {
      toast.error('Invalid reset link');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { email, token, password });
      toast.success('Password reset successful!');
      router.push('/auth/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-body text-gray-400">Invalid or expired reset link</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient py-28">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-6">
        <div className="glass-darker rounded-3xl p-8 md:p-10">
          <Link href="/" className="flex items-center justify-center gap-1.5 mb-8">
            <Logo className="w-6 h-6" />
            <span className="font-heading font-semibold text-xl">WEMINE</span>
          </Link>
          <h1 className="font-heading text-2xl font-semibold text-gray-900 text-center mb-2">Set new password</h1>
          <p className="font-body text-sm text-gray-500 text-center mb-8">Enter your new password</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">New Password</label>
              <input type="password" required minLength={8} value={password}
                onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Min. 8 characters" />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full text-base py-4">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center hero-gradient">
        <div className="w-8 h-8 border-2 border-glacier-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
