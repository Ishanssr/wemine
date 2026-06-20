'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center hero-gradient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto px-6"
      >
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-red-500 text-2xl font-heading font-semibold">!</span>
        </div>
        <h1 className="font-heading text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
        <p className="font-body text-sm text-gray-500 mb-8">An unexpected error occurred. Please try again.</p>
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
      </motion.div>
    </div>
  );
}
