'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { AnimeTextReveal } from '@/components/ui/AnimeTextReveal';

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/hero-bg.webp" alt="WEMINE premium cotton t-shirts collection" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-cream-50/40" />
      </div>

      <div className="relative max-w-7xl ml-0 mr-auto px-6 md:px-12 py-24 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="font-heading text-xs font-medium text-gray-500 tracking-[0.15em] uppercase mb-6"
          >
            Premium T-shirts
          </motion.p>

          <AnimeTextReveal
            text="Threads With Character."
            delay={200}
            className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium text-gray-900 leading-[1.05] mb-6 text-balance uppercase tracking-tight"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="font-body text-base md:text-lg text-gray-500 leading-relaxed mb-10 max-w-md"
          >
            Premium t-shirts that speak for themselves.
            Made to be worn, made to last.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <Link href="/products" className="btn-primary text-center">
              Explore Collection
            </Link>
            <Link href="/#about" className="btn-secondary text-center">
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
