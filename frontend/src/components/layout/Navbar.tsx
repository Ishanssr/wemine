'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
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
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    if (isAuthenticated) fetchCart();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isAuthenticated, fetchCart]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return false;
    return pathname.startsWith(href.split('?')[0]);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'nav-glass' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-1.5 group">
            <Logo className="w-10 h-10" />
            <span className="font-heading font-medium text-lg tracking-[0.15em]">
              WEMINE
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <LayoutGroup>
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => router.prefetch(link.href)}
                    className={`relative px-4 py-2 font-heading text-[11px] font-medium tracking-[0.1em] uppercase transition-colors duration-200 ${
                      active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-4 right-4 h-[2px] bg-black"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
            </LayoutGroup>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-all duration-200"
            >
              <Search className="w-5 h-5 text-gray-900" />
            </Link>

            <Link
              href={isAuthenticated ? '/account/wishlist' : '/auth/login'}
              className="hidden lg:flex w-10 h-10 items-center justify-center hover:bg-black/5 transition-all duration-200"
            >
              <Heart className="w-5 h-5 text-gray-900" />
            </Link>

            <Link
              href="/cart"
              className="relative w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5 text-gray-900" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center bg-black text-white text-[9px] font-medium rounded-full">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="hidden lg:flex px-2.5 py-1 text-[9px] font-heading font-medium tracking-[0.05em] uppercase text-gray-500 border border-gray-200 hover:border-gray-900 hover:text-gray-900 transition-all"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/account/profile"
                  className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-all duration-200"
                >
                  {user?.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="" width={28} height={28} className="rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-gray-900" />
                  )}
                </Link>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="hidden lg:inline-flex items-center px-5 py-2 bg-black text-white text-[11px] font-heading font-medium tracking-[0.05em] uppercase hover:bg-gray-800 transition-all duration-300"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-all"
            >
              {isOpen ? <X className="w-5 h-5 text-gray-900" /> : <Menu className="w-5 h-5 text-gray-900" />}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden transition-all duration-400 overflow-hidden ${
          isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-cream-50 border-t border-black/5 px-6 py-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 text-[11px] font-heading font-medium tracking-[0.1em] uppercase transition-all ${
                isActive(link.href) ? 'text-gray-900 bg-black/5' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-[11px] font-heading font-medium tracking-[0.05em] uppercase text-white bg-black text-center mt-2"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
