'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-6"
      >
        <h1 className="font-heading text-6xl font-semibold text-gray-200 mb-4">404</h1>
        <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="font-body text-sm text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="btn-primary">Back to Home</Link>
      </motion.div>
    </div>
  );
}
