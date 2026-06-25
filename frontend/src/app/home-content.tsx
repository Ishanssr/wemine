'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Atropos from 'atropos/react';
import 'atropos/css/core';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroSection } from '@/components/layout/HeroSection';
import { CraftStory } from '@/components/layout/CraftStory';

const features = [
  { title: 'Premium Materials', desc: '100% organic cotton, ethically sourced' },
  { title: 'Thoughtful Design', desc: 'Clean aesthetics, no unnecessary noise' },
  { title: 'Built to Last', desc: 'Reinforced construction for everyday wear' },
  { title: 'Eco-Conscious', desc: 'Sustainable packaging and practices' },
];

export default function HomeContent() {
  return (
    <>
      <HeroSection />
      <CraftStory />

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
    <section
      id="about"
      className="section-padding py-20 md:py-28 bg-black/5 relative overflow-hidden"
    >
      <div className="max-content relative">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-4">
              About WEMINE
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900 mb-6 tracking-tight">
              Designed to Mean Something
            </h2>
            <div className="space-y-4 font-body text-sm text-gray-500 leading-relaxed">
              <p>
                WEMINE creates premium cotton apparel with graphics that say something. Every piece
                starts with quality fabric — 240 GSM cotton that feels substantial without being
                heavy, pre-shrunk so the fit stays true, and constructed to hold up through hundreds
                of wears.
              </p>
              <p>
                Our graphics are designed to be worn, not just looked at. Clean lines, thoughtful
                motifs, and a sense of intention in every detail. No logos plastered everywhere —
                just designs that feel personal.
              </p>
              <p>
                Built for everyday wear, crafted for long-term comfort, and designed to stand out
                without trying too hard. The biggest thing missing from your wardrobe isn't another
                T-shirt — it's the right one.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <Link href="/products" className="btn-primary">
                Explore Collection
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get in Touch
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <Atropos activeOffset={40} shadowScale={1.05} className="aspect-[4/3] overflow-hidden relative">
              <Image
                src="/hero2.png"
                alt="WEMINE cotton fabric detail — 240 GSM premium quality"
                fill
                className="object-cover object-center"
                data-atropos-offset="-5"
              />
            </Atropos>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
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
            Why WEMINE
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
              <p className="font-body text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
