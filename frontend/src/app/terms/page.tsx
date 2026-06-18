import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service',
  description:
    'WEMINE terms of service — order and pricing policies, intellectual property, and liability information.',
  alternates: { canonical: 'https://wemine.in/terms' },
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="font-body text-sm text-gray-500 mb-8">Last updated: June 2026</p>

          <div className="space-y-6 font-body text-sm text-gray-500 leading-relaxed">
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">General</h2>
              <p>
                By using the WEMINE website and placing an order, you agree to these terms. Please
                read them carefully before making a purchase.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">
                Orders & Pricing
              </h2>
              <p>
                All prices are listed in INR and inclusive of applicable taxes. We reserve the right
                to modify prices at any time. Orders are subject to availability and acceptance.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">
                Intellectual Property
              </h2>
              <p>
                All designs, graphics, and content on this website are the property of WEMINE.
                Unauthorized reproduction or use is prohibited.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">
                Limitation of Liability
              </h2>
              <p>
                WEMINE shall not be liable for any indirect, incidental, or consequential damages
                arising from the use of our products or website.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">Contact</h2>
              <p>
                For questions regarding these terms, reach out to{' '}
                <a href="mailto:Wearwemine@gmail.com" className="text-gray-900 underline">
                  Wearwemine@gmail.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
