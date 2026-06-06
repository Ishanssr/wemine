'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroSection } from '@/components/layout/HeroSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section id="products" className="section-padding py-20 md:py-28">
        <div className="max-content">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900 tracking-tight">
                Our Collection
              </h2>
              <p className="font-body text-sm text-gray-400 mt-2 tracking-[0.05em] uppercase">
                Premium Minimal Wear
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-1 font-heading text-[11px] font-medium text-gray-400 tracking-[0.1em] uppercase hover:text-gray-900 transition-colors"
            >
              View All
            </Link>
          </motion.div>

          <ProductGrid />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center md:hidden"
          >
            <Link href="/products" className="btn-secondary">
              View All
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
    <section id="about" className="section-padding py-20 md:py-28 bg-black/5">
      <div className="max-content">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-4">
              About Wemine
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900 mb-6 tracking-tight">
              Born from the Peaks
            </h2>
            <p className="font-body text-sm text-gray-500 leading-relaxed mb-4">
              Every t-shirt is thoughtfully designed to capture the essence of alpine
              tranquility and adventure.
            </p>
            <p className="font-body text-sm text-gray-500 leading-relaxed mb-8">
              Founded by Bhavit, Wemine is a celebration of mountain culture and
              minimalist design.
            </p>
            <Link href="/products" className="btn-primary">
              Explore Collection
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="aspect-[4/3] overflow-hidden">
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
    <section className="section-padding py-20 md:py-28">
      <div className="max-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-3">
            Why Wemine
          </p>
          <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900 tracking-tight">
            Crafted for the Journey
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <h3 className="font-heading text-xs font-medium text-gray-900 mb-2 tracking-[0.05em] uppercase">
                {feature.title}
              </h3>
              <p className="font-body text-xs text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
