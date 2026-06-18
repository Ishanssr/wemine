import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Community Designs',
  description:
    'Browse and rate upcoming WEMINE t-shirt designs. Share your feedback and help shape the next collection.',
  alternates: { canonical: `${SITE_URL}/designs` },
  robots: { index: true, follow: true },
};

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
