import type { Metadata } from 'next';
import { SITE_URL, breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Shop Premium Minimalist T-Shirts',
  description:
    'Browse WEMINE premium cotton t-shirts. 240 GSM fabric, pre-shrunk, fade-resistant graphic prints. Minimalist aesthetic tees with free shipping above ₹999. Shop aesthetic t-shirts online India.',
  alternates: { canonical: `${SITE_URL}/products` },
  keywords: [
    'buy t-shirts online India', 'premium t-shirts', 'minimalist t-shirts online',
    'aesthetic t-shirts buy', '240 GSM cotton tees', 'graphic tees online India',
    'wemine shop', 'wemine collection', 'minimalist fashion shop India',
  ],
  openGraph: {
    title: 'Shop Premium Minimalist T-Shirts | WEMINE',
    description:
      'Explore WEMINE collection of premium cotton t-shirts. Minimalist aesthetic, thoughtful graphic prints, built to last. Free shipping above ₹999.',
    images: [
      {
        url: `${SITE_URL}/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: 'WEMINE Premium T-Shirts Collection — Shop Minimalist Aesthetic Tees',
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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              collectionPageJsonLd({
                name: 'WEMINE T-Shirt Collection',
                description: 'Premium minimalist cotton t-shirts with aesthetic graphic prints. 240 GSM pre-shrunk fabric, made in India.',
                url: `${SITE_URL}/products`,
                image: `${SITE_URL}/hero-bg.png`,
              }),
              breadcrumbJsonLd([
                { name: 'Home', url: SITE_URL },
                { name: 'Shop', url: `${SITE_URL}/products` },
              ]),
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
