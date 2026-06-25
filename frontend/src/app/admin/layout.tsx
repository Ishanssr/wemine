'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="glass-surface border-b border-white/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
                  <path d="M3 20L10 8L14 14L17 10L21 20H3Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-heading font-semibold text-base hidden sm:block">WEMINE Admin</span>
            </Link>
            <Link href="/" className="flex items-center gap-2 font-body text-xs text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="font-body text-xs font-medium text-gray-900">{user.email}</p>
                <p className="font-body text-[9px] text-gray-400 uppercase tracking-wider">{user.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-glacier-200 flex items-center justify-center">
                <span className="font-heading font-semibold text-xs text-glacier-700">
                  {user.firstName?.[0] || 'A'}{user.lastName?.[0] || 'W'}
                </span>
              </div>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <button onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-2 font-body text-xs text-red-500 hover:text-red-600 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-8 pb-24">
        {children}
      </main>
    </div>
  );
}
