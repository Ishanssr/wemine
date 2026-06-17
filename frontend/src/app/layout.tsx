import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Analytics } from '@vercel/analytics/react';

const outfit = {
  variable: '--font-outfit',
  className: 'font-outfit',
};

const manrope = {
  variable: '--font-manrope',
  className: 'font-manrope',
};

export const metadata: Metadata = {
  title: 'WEMINE | Premium Minimal Wear',
  description: 'Premium minimal apparel. Threads with character.',
  keywords: ['t-shirts', 'minimal wear', 'premium apparel', 'minimalist fashion'],
  icons: { icon: '/logo.png', apple: '/logo.png' },
  openGraph: {
    title: 'WEMINE | Premium Minimal Wear',
    description: 'Premium minimal apparel. Threads with character.',
    siteName: 'WEMINE',
    type: 'website',
    images: [{ url: '/hero-bg.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WEMINE | Premium Minimal Wear',
    description: 'Premium minimal apparel. Threads with character.',
    images: ['/hero-bg.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#fefcf5" />
      </head>
      <body className="min-h-screen bg-cream-50 antialiased font-body">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
