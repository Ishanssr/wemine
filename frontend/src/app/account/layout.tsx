'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Package, Heart, MapPin, Shield, Bell, Bookmark, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';

const accountLinks = [
  { label: 'Profile', href: '/account/profile', icon: User },
  { label: 'Orders', href: '/account/orders', icon: Package },
  { label: 'Prebooks', href: '/account/prebooks', icon: Bookmark },
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { label: 'Addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Security', href: '/account/security', icon: Shield },
  { label: 'Notifications', href: '/account/notifications', icon: Bell },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/auth/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return null;

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-heading text-xs font-medium text-glacier-600 tracking-[0.2em] uppercase mb-2">
              Account
            </p>
            <h1 className="font-heading text-3xl font-semibold text-gray-900">
              {user?.firstName ? `Hello, ${user.firstName}` : 'My Account'}
            </h1>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="btn-ghost text-red-500 hover:text-red-600">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <nav className="glass-surface rounded-2xl p-3 space-y-1">
              {accountLinks.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-gray-600 hover:text-gray-900 hover:bg-white/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="md:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
