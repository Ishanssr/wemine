import type { Metadata } from 'next';
import { SITE_URL, breadcrumbJsonLd, collectionPageJsonLd } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Community T-Shirt Designs — Rate & Vote',
  description:
    'Browse and rate upcoming WEMINE t-shirt designs. Share your feedback and help shape the next collection of minimalist aesthetic tees. Community-driven premium apparel.',
  alternates: { canonical: `${SITE_URL}/designs` },
  robots: { index: true, follow: true },
  keywords: [
    'wemine designs', 'upcoming t-shirt designs', 'vote t-shirt design India',
    'community fashion', 'aesthetic tee designs', 'rate t-shirt designs',
  ],
  openGraph: {
    title: 'Community T-Shirt Designs | WEMINE — Rate & Vote',
    description:
      'Explore upcoming WEMINE t-shirt designs and rate them. Your feedback shapes our next drop of premium minimalist apparel.',
    images: [
      {
        url: `${SITE_URL}/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: 'WEMINE Community T-Shirt Designs — Rate & Vote',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community T-Shirt Designs | WEMINE',
    description:
      'Rate upcoming t-shirt designs and help shape the next WEMINE collection.',
    images: [`${SITE_URL}/hero-bg.png`],
  },
};

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              collectionPageJsonLd({
                name: 'WEMINE Community Designs',
                description: 'Upcoming WEMINE t-shirt designs. Rate, vote, and help shape the next collection of premium minimalist aesthetic tees.',
                url: `${SITE_URL}/designs`,
                image: `${SITE_URL}/hero-bg.png`,
              }),
              breadcrumbJsonLd([
                { name: 'Home', url: SITE_URL },
                { name: 'Designs', url: `${SITE_URL}/designs` },
              ]),
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
