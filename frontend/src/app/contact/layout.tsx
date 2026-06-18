import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with WEMINE. Email us at Wearwemine@gmail.com or call +91 9828847782. Based in Himachal Pradesh, India.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact | WEMINE',
    description: 'We\'d love to hear from you. Reach out to the WEMINE team.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
