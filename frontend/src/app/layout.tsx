import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

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
        <meta name="theme-color" content="#f4f9f9" />
      </head>
      <body className="min-h-screen bg-glacier-50 antialiased font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
