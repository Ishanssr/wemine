import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

const outfit = {
  variable: '--font-outfit',
  className: 'font-outfit',
};

const manrope = {
  variable: '--font-manrope',
  className: 'font-manrope',
};

export const metadata: Metadata = {
  title: 'WEMINE | Premium Mountain Wear',
  description: 'Premium mountain-inspired apparel. Minimal design, maximum comfort. Founded by Bhavit.',
  keywords: ['t-shirts', 'mountain wear', 'premium apparel', 'minimalist fashion'],
  openGraph: {
    title: 'WEMINE | Premium Mountain Wear',
    description: 'Premium mountain-inspired apparel. Minimal design, maximum comfort.',
    siteName: 'WEMINE',
    type: 'website',
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
      </body>
    </html>
  );
}
