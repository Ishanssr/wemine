'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';
import { NAV_LINKS } from '@/lib/constants';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    if (isAuthenticated) fetchCart();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAuthenticated, fetchCart]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'nav-glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo className="w-7 h-7 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-heading font-semibold text-xl tracking-tight">
              WEMINE
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-glacier-500 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/50 transition-all duration-200"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </Link>

            <Link
              href={isAuthenticated ? '/account/wishlist' : '/auth/login'}
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-xl hover:bg-white/50 transition-all duration-200"
            >
              <Heart className="w-5 h-5 text-gray-600" />
            </Link>

            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/50 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center bg-black text-white text-[10px] font-bold rounded-full">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link
                href="/account/profile"
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/50 transition-all duration-200"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-600" />
                )}
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="hidden md:inline-flex items-center px-5 py-2.5 bg-black text-white text-sm font-heading font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02]"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/50 transition-all"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden transition-all duration-400 overflow-hidden ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass-darker px-6 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30 rounded-xl transition-all"
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-white bg-black rounded-xl text-center mt-2"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
