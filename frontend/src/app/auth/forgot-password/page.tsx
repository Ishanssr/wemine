'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
    } catch {
      toast.error('Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient py-28">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md mx-auto px-6"
      >
        <div className="glass-darker rounded-3xl p-8 md:p-10">
          <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
            <Logo className="w-6 h-6" />
            <span className="font-heading font-semibold text-xl">WEMINE</span>
          </Link>

          {isSent ? (
            <div className="text-center">
              <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-3">Check your email</h1>
              <p className="font-body text-sm text-gray-500 mb-6">
                If an account exists with {email}, we've sent a password reset link.
              </p>
              <Link href="/auth/login" className="btn-primary">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-semibold text-gray-900 text-center mb-2">
                Reset password
              </h1>
              <p className="font-body text-sm text-gray-500 text-center mb-8">
                Enter your email and we'll send you a reset link
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">Email</label>
                  <input type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)} className="input-field"
                    placeholder="you@example.com" />
                </div>
                <button type="submit" disabled={isLoading} className="btn-primary w-full text-base py-4">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <Link href="/auth/login" className="btn-ghost w-full justify-center mt-4">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
