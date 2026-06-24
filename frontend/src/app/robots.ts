import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/products', '/designs', '/search', '/blog', '/faq', '/contact', '/shipping', '/returns'],
        disallow: ['/api/', '/_next/', '/auth/', '/cart', '/checkout', '/account', '/admin'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/auth/', '/cart', '/checkout', '/account', '/admin'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/auth/', '/cart', '/checkout', '/account', '/admin'],
      },
    ],
    sitemap: 'https://wemine.in/sitemap.xml',
    host: 'https://wemine.in',
  };
}
