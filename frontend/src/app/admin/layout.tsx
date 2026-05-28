'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Users, ShoppingCart, Tag, Image, FileText, LogOut,
} from 'lucide-react';
import { api, formatINR } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Banners', href: '/admin/banners', icon: Image },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
];

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
    <div className="min-h-screen bg-glacier-50">
      <div className="flex">
        <aside className="hidden md:flex w-64 min-h-screen flex-col glass-darker border-r border-white/40 p-4 fixed left-0 top-0">
          <Link href="/admin" className="flex items-center gap-2.5 mb-8 px-3 pt-2">
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-4 h-4">
                <path d="M3 20L10 8L14 14L17 10L21 20H3Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-heading font-semibold text-base">Wemine Admin</span>
          </Link>

          <nav className="flex-1 space-y-1">
            {sidebarLinks.map(({ label, href, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-gray-600 hover:text-gray-900 hover:bg-white/40 transition-all"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/40 pt-4 mt-4">
            <div className="flex items-center gap-3 px-4 mb-3">
              <div className="w-8 h-8 rounded-full bg-glacier-200 flex items-center justify-center">
                <span className="font-heading font-semibold text-xs text-glacier-700">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium text-gray-900 truncate">{user.email}</p>
                <p className="font-body text-[10px] text-gray-400 uppercase tracking-wider">{user.role}</p>
              </div>
            </div>
            <button onClick={() => { logout(); router.push('/'); }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-body text-sm text-red-500 hover:bg-red-50 transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </aside>

        <main className="flex-1 md:ml-64 pt-8 pb-16 px-6 md:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
