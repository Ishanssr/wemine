import Link from 'next/link';
import { ArrowLeft, RotateCcw, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Returns & Exchanges',
  description:
    'WEMINE return policy — 14-day return window for unworn items. Free returns, easy process. Contact us for defective items within 48 hours.',
  alternates: { canonical: 'https://wemine.in/returns' },
  openGraph: {
    title: 'Returns & Exchanges | WEMINE',
    description:
      'Hassle-free returns within 14 days of delivery. Items must be unworn with tags attached.',
  },
};

export default function ReturnsPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-heading text-[11px] text-gray-400 tracking-[0.1em] uppercase hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Returns & Exchanges
          </h1>
          <p className="font-body text-sm text-gray-500 mb-10">
            Our return policy is straightforward and customer-friendly.
          </p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <RotateCcw className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="font-heading text-sm font-medium text-gray-900 mb-1">
                  Return Window
                </h2>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  You may return unworn, unwashed items within 14 days of delivery for a full refund
                  or exchange. Items must be in original condition with tags attached.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <RefreshCw className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="font-heading text-sm font-medium text-gray-900 mb-1">
                  How to Initiate a Return
                </h2>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  Log into your account and navigate to your orders. Select the item you wish to
                  return and follow the prompts. You will receive a return authorization and shipping
                  label via email.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="font-heading text-sm font-medium text-gray-900 mb-1">
                  Refund Processing
                </h2>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  Refunds are processed within 5-7 business days after we receive your return. The
                  amount will be credited to your original payment method.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="font-heading text-sm font-medium text-gray-900 mb-1">Exceptions</h2>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  Final sale items, accessories, and personalized products are not eligible for
                  returns. If you receive a defective item, please contact us within 48 hours of
                  delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Returns & Exchanges — WEMINE',
              breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://wemine.in/' },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Returns',
                    item: 'https://wemine.in/returns',
                  },
                ],
              },
            }),
          }}
        />
      </div>
    </div>
  );
}
