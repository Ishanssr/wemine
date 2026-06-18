import Link from 'next/link';
import { ArrowLeft, Newspaper } from 'lucide-react';

export const metadata = {
  title: 'Blog',
  description:
    'WEMINE blog — stories about premium t-shirts, design process, fabric quality, and the people behind the brand.',
  alternates: { canonical: 'https://wemine.in/blog' },
  openGraph: {
    title: 'Blog | WEMINE',
    description:
      'Stories, process, and thoughts from the WEMINE team. Behind the brand, fabric guides, and design insights.',
    type: 'website',
  },
};

const posts = [
  {
    title: 'Behind the Brand: Why We Started WEMINE',
    excerpt: 'The story of two friends who wanted better t-shirts.',
    date: 'Coming Soon',
  },
  {
    title: 'The 240 GSM Difference',
    excerpt: 'Why fabric weight matters more than you think.',
    date: 'Coming Soon',
  },
  {
    title: 'How We Design Our Graphics',
    excerpt: 'From sketch to screen print — our creative process.',
    date: 'Coming Soon',
  },
];

export default function BlogPage() {
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
            Blog
          </h1>
          <p className="font-body text-sm text-gray-500 mb-10">
            Stories, process, and thoughts from the WEMINE team.
          </p>

          <div className="space-y-6">
            {posts.map((post, i) => (
              <div key={i} className="border-b border-black/5 pb-6">
                <p className="font-body text-[10px] text-gray-400 tracking-[0.1em] uppercase mb-2">
                  {post.date}
                </p>
                <h2 className="font-heading text-base font-medium text-gray-900 mb-1">
                  {post.title}
                </h2>
                <p className="font-body text-sm text-gray-500">{post.excerpt}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center py-12 border-t border-black/5">
            <Newspaper className="w-8 h-8 text-gray-200 mx-auto mb-3" />
            <p className="font-body text-sm text-gray-400">
              More stories coming soon. Follow us on social media for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
