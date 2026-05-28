'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center max-w-md mx-auto px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
      </motion.div>
      <h1 className="font-heading text-3xl font-semibold text-gray-900 mb-3">
        Payment Successful!
      </h1>
      <p className="font-body text-gray-500 mb-2">
        Thank you for your purchase.
      </p>
      {orderNumber && (
        <p className="font-body text-sm text-gray-400 mb-8">
          Order: <span className="font-mono">{orderNumber}</span>
        </p>
      )}
      <div className="flex flex-col gap-3">
        <Link
          href="/account/orders"
          className="btn-primary"
        >
          View Orders
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/products"
          className="btn-ghost"
        >
          Continue Shopping
        </Link>
      </div>
    </motion.div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-28 pb-24 flex items-center justify-center min-h-screen">
      <Suspense fallback={
        <div className="w-8 h-8 border-2 border-glacier-400 border-t-transparent rounded-full animate-spin" />
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
