import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Explore WEMINE collections — premium t-shirts, hoodies, and apparel. Each piece thoughtfully designed with 240 GSM cotton.',
  alternates: { canonical: `${SITE_URL}/collections` },
  openGraph: {
    title: 'Collections | WEMINE',
    description: 'Explore our premium apparel collections. Thoughtful design meets quality fabric.',
  },
};

const collections = [
  {
    name: 'T-Shirts',
    slug: 't-shirts',
    desc: 'Premium 240 GSM cotton tees with original graphics. Pre-shrunk, fade-resistant, built for everyday wear.',
  },
  {
    name: 'Hoodies',
    slug: 'hoodies',
    desc: 'Heavyweight cotton hoodies designed for comfort. Clean lines, thoughtful details.',
  },
  {
    name: 'Jackets',
    slug: 'jackets',
    desc: 'Outerwear that bridges style and function. Premium materials, refined construction.',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    desc: 'Everyday essentials that complete the look. Minimal, functional, well-made.',
  },
];

export default function CollectionsPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="mb-12">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            Collections
          </h1>
          <p className="font-body text-sm text-gray-500 max-w-lg">
            Every WEMINE piece starts with quality fabric and ends with a design that means
            something.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/products?category=${col.slug}`}
              className="group border border-black/10 p-8 hover:bg-black/5 transition-all duration-300"
            >
              <h2 className="font-heading text-xl font-medium text-gray-900 mb-2 group-hover:text-gray-500 transition-colors">
                {col.name}
              </h2>
              <p className="font-body text-sm text-gray-400 leading-relaxed">{col.desc}</p>
            </Link>
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Collections',
                      item: `${SITE_URL}/collections`,
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </div>
    </div>
  );
}
