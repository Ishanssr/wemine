import type { Metadata } from 'next';
import { SITE_URL, faqJsonLd } from '@/lib/json-ld';

const faqs = [
  {
    question: 'What fabrics do you use?',
    answer:
      'We use 240 GSM premium cotton for our t-shirts. The fabric is pre-shrunk and fade-resistant, built to last through 100+ washes.',
  },
  {
    question: 'How do I find my size?',
    answer:
      'Refer to our size chart on each product page. If you are between sizes, we recommend sizing up for a relaxed fit.',
  },
  {
    question: 'Do you ship internationally?',
    answer:
      'Yes, we ship to select countries. Shipping rates and timelines are calculated at checkout.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We accept returns within 14 days of delivery. Items must be unworn with tags attached. See our Returns page for details.',
  },
  {
    question: 'How long does shipping take?',
    answer:
      'Orders are processed in 1-2 business days. Standard domestic shipping takes 5-7 business days.',
  },
  {
    question: 'How do I care for my WEMINE apparel?',
    answer:
      'Machine wash cold, inside out. Tumble dry low or air dry. Avoid bleach and fabric softener to preserve the print quality.',
  },
];

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about WEMINE premium t-shirts — fabric, sizing, shipping, returns, and care instructions.',
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: 'FAQ | WEMINE',
    description: 'Answers to common questions about our products, shipping, and policies.',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              faqJsonLd(faqs),
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                  { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE_URL}/faq` },
                ],
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
