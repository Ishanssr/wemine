'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroSection } from '@/components/layout/HeroSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section id="products" className="section-padding py-16 md:py-24">
        <div className="max-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10 md:mb-14"
          >
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900">
                Our Collection
              </h2>
              <p className="font-body text-sm text-gray-400 mt-1.5">
                Premium Minimal Wear
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-1 font-body text-sm text-gray-400 hover:text-gray-900 transition-colors"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          <ProductGrid />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center md:hidden"
          >
            <Link href="/products" className="btn-secondary">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <AboutSection />

      <FeaturesSection />
    </>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section-padding py-24 bg-cream-100/50">
      <div className="max-content">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-heading text-xs font-medium text-glacier-600 tracking-[0.2em] uppercase mb-3">
              About Wemine
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-6">
              Born from the Peaks
            </h2>
            <p className="font-body text-gray-500 leading-relaxed mb-4">
              Every t-shirt is thoughtfully designed to capture the essence of alpine
              tranquility and adventure.
            </p>
            <p className="font-body text-gray-500 leading-relaxed mb-8">
              Founded by Bhavit, Wemine is a celebration of mountain culture and
              minimalist design. We believe in creating premium, timeless pieces that
              connect you to the peaks you love.
            </p>
            <Link href="/products" className="btn-primary">
              Explore Collection
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden">
              <img src="/hero2.png" alt="" className="w-full h-full object-cover object-center" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: 'Premium Materials', desc: '100% organic cotton, ethically sourced' },
    { title: 'Minimal Design', desc: 'Clean aesthetics inspired by alpine peaks' },
    { title: 'Built to Last', desc: 'Premium construction for everyday wear' },
    { title: 'Eco-Conscious', desc: 'Sustainable packaging and practices' },
  ];

  return (
    <section className="section-padding py-24">
      <div className="max-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-heading text-xs font-medium text-glacier-600 tracking-[0.2em] uppercase mb-3">
            Why Wemine
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900">
            Crafted for the Journey
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-surface rounded-2xl p-6 md:p-8 text-center"
            >
              <h3 className="font-heading font-semibold text-sm text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-xs text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
