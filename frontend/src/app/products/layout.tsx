import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse WEMINE premium cotton t-shirts and apparel. 240 GSM fabric, pre-shrunk, fade-resistant. Free shipping above ₹999.',
  alternates: { canonical: `${SITE_URL}/products` },
  openGraph: {
    title: 'Shop Premium T-Shirts | WEMINE',
    description:
      'Explore our collection of premium cotton t-shirts. Thoughtful design, built to last.',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
