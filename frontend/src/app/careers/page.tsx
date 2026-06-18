import Link from 'next/link';
import { ArrowLeft, Briefcase } from 'lucide-react';

export const metadata = {
  title: 'Careers',
  description:
    'Join the WEMINE team. We are building something meaningful — premium apparel brand based in Himachal Pradesh, India.',
  alternates: { canonical: 'https://wemine.in/careers' },
};

export default function CareersPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 font-heading text-[11px] text-gray-400 tracking-[0.1em] uppercase hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <div className="text-center">
          <Briefcase className="w-10 h-10 text-gray-200 mx-auto mb-4" />
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Careers
          </h1>
          <p className="font-body text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
            We are a small team building something meaningful. When we have openings, they will be
            listed here.
          </p>
          <p className="font-body text-sm text-gray-400">
            In the meantime, say hi at{' '}
            <a href="mailto:Wearwemine@gmail.com" className="text-gray-900 underline">
              Wearwemine@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
