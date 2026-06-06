'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="/hero-bg.png" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl ml-0 mr-auto px-6 md:px-12 py-32 md:py-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-heading text-base md:text-lg font-medium text-gray-900 tracking-widest uppercase mb-6"
          >
            Premium T-shirts
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-gray-900 leading-[1.05] mb-6 text-balance"
          >
            Threads With
            <br />
            <span className="text-gradient">Character.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-body text-lg md:text-xl font-semibold text-gray-900 leading-relaxed mb-10 max-w-lg"
          >
            Premium t-shirts that speak for themselves.
            Made to be worn, made to last.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/products"
              className="btn-primary group text-lg px-10 py-4"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#about"
              className="btn-secondary text-lg px-10 py-4"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
