'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, Clock, Shield } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Link href="/" className="inline-flex items-center gap-1.5 font-heading text-[11px] text-gray-400 tracking-[0.1em] uppercase hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Shipping</h1>
          <p className="font-body text-sm text-gray-500 mb-10">Information on delivery timelines and shipping policies.</p>

          <div className="space-y-8">
            <div className="flex gap-4">
              <Truck className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="font-heading text-sm font-medium text-gray-900 mb-1">Delivery Timeline</h2>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  Orders are processed within 1-2 business days. Standard shipping takes 5-7 business days
                  within India. International shipping timelines vary by destination.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Package className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="font-heading text-sm font-medium text-gray-900 mb-1">Order Tracking</h2>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  Once your order ships, you will receive a tracking number via email. You can also track
                  your order from your account dashboard.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="font-heading text-sm font-medium text-gray-900 mb-1">Shipping Rates</h2>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  Free shipping on orders above ₹999. A flat ₹99 shipping fee applies to orders below that.
                  International shipping rates are calculated at checkout.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <h2 className="font-heading text-sm font-medium text-gray-900 mb-1">Shipping Coverage</h2>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  We currently ship across all major cities in India. International shipping is available
                  to select countries. If your location is not listed at checkout, please contact us.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
