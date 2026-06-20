import './globals.css';
import type { Metadata } from 'next';
import { Outfit, Manrope } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ORGANIZATION_JSON_LD, WEBSITE_JSON_LD } from '@/lib/json-ld';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const siteUrl = 'https://wemine.in';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | WEMINE',
    default: 'WEMINE | Premium Minimal Wear — Premium Cotton T-Shirts',
  },
  description:
    'Premium cotton t-shirts with graphics that mean something. 240 GSM pre-shrunk fabric, thoughtful design, built to last. Free shipping above ₹999.',
  keywords: [
    'premium t-shirts India',
    'minimal apparel',
    'cotton t-shirts',
    '240 GSM t-shirts',
    'WEMINE clothing',
    'graphic tees',
    'minimalist fashion',
    'Indian clothing brand',
  ],
  robots: { index: true, follow: true },
  icons: { icon: '/logo.png', apple: '/logo.png' },
  alternates: { canonical: siteUrl },
  verification: { google: 'VFCaIqReHaD5Vpbi9QenXU_A3MhzsmpuZRwU9wFzIa8' },
  openGraph: {
    title: 'WEMINE | Premium Minimal Wear — Premium Cotton T-Shirts',
    description:
      'Premium cotton t-shirts with graphics that mean something. 240 GSM pre-shrunk fabric, thoughtful design, built to last.',
    siteName: 'WEMINE',
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: 'WEMINE Premium Cotton T-Shirts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wemine',
    creator: '@wemine',
    title: 'WEMINE | Premium Minimal Wear',
    description:
      'Premium cotton t-shirts with graphics that mean something. 240 GSM pre-shrunk fabric, built to last.',
    images: [`${siteUrl}/hero-bg.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable} scroll-smooth`}>
      <head>
        <meta name="theme-color" content="#fefcf5" />
        <meta name="color-scheme" content="light" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [ORGANIZATION_JSON_LD, WEBSITE_JSON_LD],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-cream-50 antialiased font-body">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
