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
      <header className="bg-white border-b border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-heading font-medium text-sm tracking-[0.1em] uppercase text-black hover:opacity-50 transition-opacity">
              WEMINE Admin
            </Link>
            <div className="w-px h-4 bg-black/20 hidden sm:block" />
            <Link href="/" className="font-body text-xs tracking-wider uppercase text-gray-500 hover:text-black transition-colors hidden sm:block">
              Return to Store
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <p className="font-body text-xs tracking-wider uppercase text-black hidden sm:block">
              {user.email}
            </p>
            <button onClick={() => { logout(); router.push('/'); }}
              className="font-body text-xs font-medium tracking-[0.1em] uppercase text-red-600 hover:text-red-800 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10 pb-24">
        {children}
      </main>
    </div>
  );
}
