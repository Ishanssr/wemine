'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { CONTACT, FOOTER_LINKS } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-1.5 mb-4">
              <Logo className="w-6 h-6" />
              <span className="font-heading font-medium text-sm tracking-[0.15em]">WEMINE</span>
            </Link>
            <p className="font-body text-xs text-gray-400 leading-relaxed max-w-xs">
              Premium minimal apparel. Threads with character.
            </p>
            <div className="mt-4 space-y-1.5">
              <p className="font-body text-[11px] text-gray-400">+91 9828847782</p>
               <p className="font-body text-[11px] text-gray-400">{CONTACT.email}</p>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-gray-400">
            &copy; 2024 WEMINE. Founded by Bhavit. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="font-body text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="font-body text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Terms
            </Link>
            <Link href="/shipping" className="font-body text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
