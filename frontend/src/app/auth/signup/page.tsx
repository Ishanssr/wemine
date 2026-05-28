'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth-store';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(form);
      toast.success('Account created!');
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create account');
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

          <h1 className="font-heading text-2xl font-semibold text-gray-900 text-center mb-2">
            Create your account
          </h1>
          <p className="font-body text-sm text-gray-500 text-center mb-8">
            Join the mountain community
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">First Name</label>
                <input type="text" required value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="input-field" placeholder="John" />
              </div>
              <div>
                <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">Last Name</label>
                <input type="text" required value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="input-field" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">Email</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">Phone (optional)</label>
              <input type="tel" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-field" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">Password</label>
              <input type="password" required minLength={8} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field" placeholder="Min. 8 characters" />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full text-base py-4">
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="font-body text-xs text-gray-400 text-center mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-gray-900 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
