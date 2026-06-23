import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/json-ld';

async function getDesign(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.wemine.in';
    const res = await fetch(`${baseUrl}/api/designs/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const design = await getDesign(id);
  if (!design) {
    return { title: 'Design Not Found' };
  }

  return {
    title: `${design.title} — Community Design`,
    description:
      design.description || `Rate the ${design.title} t-shirt design by WEMINE. Share your feedback.`,
    alternates: { canonical: `${SITE_URL}/designs/${id}` },
    openGraph: {
      title: `${design.title} | WEMINE`,
      description: design.description?.slice(0, 160) || '',
      images: design.imageUrl
        ? [{ url: design.imageUrl, width: 1200, height: 1500, alt: design.title }]
        : undefined,
    },
  };
}

export default function DesignDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
