import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Community Designs',
  description:
    'Browse and rate upcoming WEMINE t-shirt designs. Share your feedback and help shape the next collection of minimalist aesthetic tees.',
  alternates: { canonical: `${SITE_URL}/designs` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Community T-Shirt Designs | WEMINE',
    description:
      'Explore upcoming WEMINE t-shirt designs and rate them. Your feedback shapes our next drop of premium minimalist apparel.',
    images: [
      {
        url: `${SITE_URL}/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: 'WEMINE Community T-Shirt Designs',
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
  return <>{children}</>;
}
