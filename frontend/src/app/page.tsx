import type { Metadata } from 'next';
import HomeContent from './home-content';
import { SITE_URL, ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, breadcrumbJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'WEMINE | Premium Cotton T-Shirts — Designed to Mean Something',
  description:
    'Premium cotton t-shirts with graphics that say something. 240 GSM pre-shrunk fabric made in India. Free shipping above ₹999.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'WEMINE | Premium Cotton T-Shirts',
    description:
      'Premium cotton t-shirts with graphics that say something. 240 GSM pre-shrunk fabric, built to last.',
    type: 'website',
    url: SITE_URL,
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
