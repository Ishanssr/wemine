import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Outfit, Manrope } from 'next/font/google';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, BRAND_JSON_LD, CLOTHING_STORE_JSON_LD } from '@/lib/json-ld';
import { ALL_KEYWORDS, GEO } from '@/lib/seo';

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
    template: '%s | WEMINE — Premium Minimalist T-Shirts India',
    default: 'WEMINE | Premium Minimalist T-Shirts — Aesthetic Cotton Apparel India',
  },
  description:
    'WEMINE — India\'s premium minimalist t-shirt brand. 240 GSM pre-shrunk cotton, fade-resistant thoughtful graphic prints. Aesthetic apparel built to last. Free shipping above ₹999. Shop now at wemine.in',
  keywords: ALL_KEYWORDS,
  robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  icons: { icon: '/logofinal.png', apple: '/logofinal.png' },
  alternates: {
    canonical: siteUrl,
    languages: { 'en-IN': siteUrl },
  },
  verification: { google: 'VFCaIqReHaD5Vpbi9QenXU_A3MhzsmpuZRwU9wFzIa8' },
  category: 'Fashion & Apparel',
  creator: 'WEMINE',
  publisher: 'WEMINE',
  openGraph: {
    title: 'WEMINE | Premium Minimalist T-Shirts — Aesthetic Apparel India',
    description:
      'Premium cotton t-shirts with minimalist aesthetic. 240 GSM pre-shrunk fabric, thoughtful graphic prints, built to last. Made in India. Free shipping above ₹999.',
    siteName: 'WEMINE',
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/hero-bg.png`,
        width: 1200,
        height: 630,
        alt: 'WEMINE — Premium Minimalist T-Shirts & Aesthetic Cotton Apparel India',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@wemine',
    creator: '@wemine',
    title: 'WEMINE | Premium Minimalist T-Shirts India',
    description:
      'Premium cotton t-shirts with aesthetic graphic prints. 240 GSM pre-shrunk fabric, built to last. Made in India.',
    images: [`${siteUrl}/hero-bg.png`],
  },
  other: {
    'geo.region': GEO.region,
    'geo.placename': GEO.placename,
    'ICBM': GEO.position,
    'og:locale:alternate': 'hi_IN',
    'format-detection': 'telephone=no',
  },
};

export const viewport: Viewport = {
  themeColor: '#fefcf5',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${manrope.variable} scroll-smooth`}>
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://api.wemine.in" />
        <link rel="dns-prefetch" href="https://api.wemine.in" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [ORGANIZATION_JSON_LD, WEBSITE_JSON_LD, BRAND_JSON_LD, CLOTHING_STORE_JSON_LD],
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
