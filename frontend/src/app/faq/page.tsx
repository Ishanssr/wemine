'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What fabrics do you use?', a: 'We use 240 GSM premium cotton for our t-shirts. The fabric is pre-shrunk and fade-resistant, built to last through 100+ washes.' },
  { q: 'How do I find my size?', a: 'Refer to our size chart on each product page. If you are between sizes, we recommend sizing up for a relaxed fit.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to select countries. Shipping rates and timelines are calculated at checkout.' },
  { q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery. Items must be unworn with tags attached. See our Returns page for details.' },
  { q: 'How long does shipping take?', a: 'Orders are processed in 1-2 business days. Standard domestic shipping takes 5-7 business days.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 24 hours of placement. After that, the order is in processing and cannot be modified.' },
  { q: 'How do I care for my WEMINE apparel?', a: 'Machine wash cold, inside out. Tumble dry low or air dry. Avoid bleach and fabric softener to preserve the print quality.' },
  { q: 'Do you have a physical store?', a: 'We are currently online-only. Stay tuned for pop-up events and stockists in your city.' },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Link href="/" className="inline-flex items-center gap-1.5 font-heading text-[11px] text-gray-400 tracking-[0.1em] uppercase hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-4">FAQ</h1>
          <p className="font-body text-sm text-gray-500 mb-10">Common questions about our products, shipping, and policies.</p>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-black/5">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="font-heading text-sm font-medium text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="font-body text-sm text-gray-500 leading-relaxed pb-4">{faq.a}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
