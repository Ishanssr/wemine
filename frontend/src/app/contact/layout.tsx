import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/json-ld';

const CONTACT_POINT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact WEMINE',
  description: 'Get in touch with WEMINE premium apparel team.',
  url: `${SITE_URL}/contact`,
  mainEntity: {
    '@type': 'Organization',
    name: 'WEMINE',
    url: SITE_URL,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9828847782',
      email: 'hello@wemine.in',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
    },
  },
};

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with WEMINE. Email us at hello@wemine.in or call +91 9828847782. Based in Himachal Pradesh, India.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact | WEMINE — Premium Cotton T-Shirts',
    description: 'We\'d love to hear from you. Reach out to the WEMINE team for orders, feedback, or collaborations.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_POINT_JSON_LD) }}
      />
      {children}
    </>
  );
}
