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

export default async function ProductDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return <>{children}</>;

  const imageUrl = product.images?.[0]?.url;
  const price = product.variants?.[0]?.price;
  const ratingValue = product.rating || product.averageRating;
  const reviewCount = product.reviewCount || product.numReviews;

  const jsonLd = productJsonLd({
    name: product.name,
    description: product.description?.slice(0, 200) || product.name,
    image: imageUrl || `${SITE_URL}/og-image.png`,
    sku: product.sku || product.id,
    brand: 'WEMINE',
    price: price || 0,
    currency: 'INR',
    availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    ratingValue: ratingValue,
    reviewCount: reviewCount,
    url: `${SITE_URL}/product/${slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            ...jsonLd,
          }),
        }}
      />
      {children}
    </>
  );
}
