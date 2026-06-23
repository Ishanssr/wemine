import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Browse WEMINE premium cotton t-shirts and apparel. 240 GSM fabric, pre-shrunk, fade-resistant. Minimalist aesthetic tees with free shipping above ₹999.',
  alternates: { canonical: `${SITE_URL}/products` },
  openGraph: {
    title: 'Shop Premium Minimalist T-Shirts | WEMINE',
    description:
      'Explore our collection of premium cotton t-shirts. Minimalist aesthetic, thoughtful design, built to last. Free shipping above ₹999.',
    images: [
      {
        url: `${SITE_URL}/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: 'WEMINE Premium T-Shirts Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Premium Minimalist T-Shirts | WEMINE',
    description:
      'Premium cotton t-shirts with minimalist aesthetic. 240 GSM fabric, free shipping above ₹999.',
    images: [`${SITE_URL}/hero-bg.png`],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
