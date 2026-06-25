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
        <div className="flex items-end justify-between mb-10 border-b border-black pb-4">
          <div>
            <h1 className="font-heading text-4xl font-medium text-black tracking-tight uppercase">
              {user?.firstName ? `Hello, ${user.firstName}` : 'My Account'}
            </h1>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="font-heading text-[10px] font-medium tracking-[0.1em] uppercase text-red-600 hover:opacity-50 transition-opacity flex items-center gap-2">
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <nav className="border border-black/10 bg-white">
              {accountLinks.map(({ label, href, icon: Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-6 py-4 font-heading text-[10px] tracking-[0.1em] uppercase text-black border-b border-black/5 hover:bg-black/5 transition-colors last:border-b-0"
                >
                  <Icon className="w-4 h-4 text-gray-400" />
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
