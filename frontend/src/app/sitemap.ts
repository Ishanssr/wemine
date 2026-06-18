import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/json-ld';

const STATIC_URLS = [
  { url: '', priority: 1.0, changeFreq: 'weekly' as const },
  { url: '/products', priority: 0.9, changeFreq: 'daily' as const },
  { url: '/shipping', priority: 0.4, changeFreq: 'monthly' as const },
  { url: '/returns', priority: 0.4, changeFreq: 'monthly' as const },
  { url: '/faq', priority: 0.6, changeFreq: 'monthly' as const },
  { url: '/contact', priority: 0.5, changeFreq: 'monthly' as const },
  { url: '/blog', priority: 0.5, changeFreq: 'weekly' as const },
  { url: '/privacy', priority: 0.3, changeFreq: 'monthly' as const },
  { url: '/terms', priority: 0.3, changeFreq: 'monthly' as const },
  { url: '/careers', priority: 0.3, changeFreq: 'monthly' as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let designUrls: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://wemine-api.onrender.com'}/designs?limit=100`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data?.designs) {
      designUrls = data.designs.map((d: any) => ({
        url: `${SITE_URL}/designs/${d.id}`,
        lastModified: new Date(d.updatedAt || d.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
    }
  } catch {
    // API unavailable — serve just static URLs
  }

  const staticUrls: MetadataRoute.Sitemap = STATIC_URLS.map(({ url, priority, changeFreq }) => ({
    url: `${SITE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }));

  return [...staticUrls, ...designUrls];
}
