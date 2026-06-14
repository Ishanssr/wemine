'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Github, Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
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
          <Link href="/" className="flex items-center justify-center gap-1.5 mb-8">
            <Logo className="w-6 h-6" />
            <span className="font-heading font-semibold text-xl">WEMINE</span>
          </Link>

          <h1 className="font-heading text-2xl font-semibold text-gray-900 text-center mb-2">
            Welcome back
          </h1>
          <p className="font-body text-sm text-gray-500 text-center mb-8">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>

            <div className="relative">
              <label className="font-body text-xs font-medium text-gray-600 mb-1.5 block">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="font-body text-xs text-glacie-600 hover:text-glacier-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full text-base py-4"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/40" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white/60 px-3 font-body text-xs text-gray-400">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`${API_URL}/auth/google`}
              className="btn-secondary justify-center py-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </a>
            <a
              href={`${API_URL}/auth/github`}
              className="btn-secondary justify-center py-3"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>

          <p className="font-body text-xs text-gray-400 text-center mt-6">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-gray-900 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
