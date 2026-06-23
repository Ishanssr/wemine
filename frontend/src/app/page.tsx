import type { Metadata } from 'next';
import HomeContent from './home-content';
import { SITE_URL, ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, breadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'WEMINE | Premium Cotton T-Shirts — Minimalist Aesthetic Apparel',
  description:
    'Premium cotton t-shirts with minimalist aesthetic and graphics that mean something. 240 GSM pre-shrunk fabric, made in India. Free shipping above ₹999. Shop aesthetic tees and minimal wear.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'WEMINE | Premium Minimalist T-Shirts',
    description:
      'Premium cotton t-shirts with minimalist aesthetic. 240 GSM pre-shrunk fabric, thoughtful design, built to last. Free shipping above ₹999.',
    type: 'website',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEMINE | Premium Minimalist T-Shirts',
    description:
      'Premium cotton t-shirts with minimalist aesthetic. 240 GSM pre-shrunk fabric, made in India.',
    images: [`${SITE_URL}/hero-bg.png`],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              ORGANIZATION_JSON_LD,
              WEBSITE_JSON_LD,
              breadcrumbJsonLd([{ name: 'Home', url: SITE_URL }]),
            ],
          }),
        }}
      />
      <HomeContent />
    </>
  );
}
