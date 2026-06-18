'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <Link href="/" className="inline-flex items-center gap-1.5 font-heading text-[11px] text-gray-400 tracking-[0.1em] uppercase hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="font-body text-sm text-gray-500 mb-8">Last updated: June 2026</p>

          <div className="space-y-6 font-body text-sm text-gray-500 leading-relaxed">
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">Information We Collect</h2>
              <p>We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email address, shipping address, and payment information.</p>
            </div>
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">How We Use Your Information</h2>
              <p>Your information is used to process orders, communicate order updates, improve our products, and send occasional updates if you have opted in.</p>
            </div>
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">Data Protection</h2>
              <p>We implement industry-standard security measures to protect your personal information. Payment data is processed securely through our payment partners and is never stored on our servers.</p>
            </div>
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">Third-Party Sharing</h2>
              <p>We do not sell your personal information. Data is shared only with trusted partners necessary to fulfill orders (shipping carriers, payment processors).</p>
            </div>
            <div>
              <h2 className="font-heading text-sm font-medium text-gray-900 mb-2">Contact</h2>
              <p>For privacy-related inquiries, reach out to <a href="mailto:Wearwemine@gmail.com" className="text-gray-900 underline">Wearwemine@gmail.com</a>.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
