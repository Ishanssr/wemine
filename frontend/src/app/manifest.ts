import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'WEMINE — Premium Minimalist T-Shirts',
    short_name: 'WEMINE',
    description:
      'Premium cotton t-shirts with minimalist aesthetic. 240 GSM pre-shrunk fabric, thoughtful design, built to last. Made in India.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fefcf5',
    theme_color: '#fefcf5',
    orientation: 'portrait-primary',
    categories: ['shopping', 'fashion', 'lifestyle'],
    lang: 'en-IN',
    icons: [
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
