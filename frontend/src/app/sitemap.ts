import type { MetadataRoute } from 'next';

const SITE_URL = 'https://wemine.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.wemine.in';

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/designs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/products?limit=100`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const products = data.data || data.products || data;
      if (Array.isArray(products)) {
        productPages = products.map((p: { slug: string; updatedAt?: string }) => ({
          url: `${SITE_URL}/product/${p.slug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }));
      }
    }
  } catch {}

  return [...staticPages, ...productPages];
}
