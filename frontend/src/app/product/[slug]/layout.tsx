import type { Metadata } from 'next';
import { SITE_URL, productJsonLd } from '@/lib/json-ld';

async function getProduct(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.wemine.in';
    const res = await fetch(`${baseUrl}/api/products/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The product you are looking for does not exist.',
    };
  }

  const name = product.name;
  const description =
    product.description ||
    `Shop ${name} at WEMINE. Premium quality apparel designed to last.`;
  const imageUrl = product.images?.[0]?.url;
  const priceText = product.variants?.[0]?.price
    ? ` — ₹${product.variants[0].price}`
    : '';
  const categoryText = product.tags?.length ? ` ${product.tags[0]}` : '';

  return {
    title: `${name}${categoryText}${priceText}`,
    description: description.slice(0, 160),
    alternates: { canonical: `${SITE_URL}/product/${slug}` },
    openGraph: {
      title: `${name} | WEMINE`,
      description: description.slice(0, 160),
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 1500, alt: name }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | WEMINE`,
      description: description.slice(0, 160),
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
