import type { Metadata } from 'next';
import HomeContent from './home-content';
import { SITE_URL } from '@/lib/json-ld';

async function fetchDesigns() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.wemine.in'}/designs`, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    return (data.designs || []) as any[];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'WEMINE | Premium Minimalist T-Shirts — Aesthetic Cotton Apparel India',
  description:
    'Shop WEMINE — India\'s premium minimalist t-shirt brand. 240 GSM pre-shrunk cotton, fade-resistant graphic prints, aesthetic designs. Free shipping above ₹999. Thoughtful apparel built to last.',
  alternates: { canonical: SITE_URL },
  keywords: [
    'wemine', 'wemine india', 'wemine t-shirts', 'premium t-shirts India',
    'minimalist t-shirts', 'aesthetic t-shirts', 'graphic tees India',
    '240 GSM t-shirts', 'cotton t-shirts online India', 'minimalist fashion India',
    'thoughtful print t-shirts', 'premium cotton tees', 'aesthetic clothing India',
  ],
  openGraph: {
    title: 'WEMINE | Premium Minimalist T-Shirts — Aesthetic Apparel India',
    description:
      'Premium cotton t-shirts with minimalist aesthetic. 240 GSM pre-shrunk fabric, thoughtful graphic prints, built to last. Made in India. Free shipping above ₹999.',
    type: 'website',
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: 'WEMINE Premium Minimalist T-Shirts Collection — Aesthetic Cotton Apparel India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEMINE | Premium Minimalist T-Shirts India',
    description:
      'Premium cotton t-shirts with aesthetic graphic prints. 240 GSM pre-shrunk fabric, made in India. Free shipping above ₹999.',
    images: [`${SITE_URL}/hero-bg.png`],
  },
};

export default async function HomePage() {
  const initialDesigns = await fetchDesigns();
  return <HomeContent initialDesigns={initialDesigns} />;
}
