'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="/hero-bg.png" alt="" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 md:from-white/20 md:via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl ml-0 mr-auto px-6 md:px-12 py-24 md:py-40">
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
            className="font-heading text-sm md:text-lg font-medium text-gray-900 tracking-widest uppercase mb-4 md:mb-6"
          >
            Premium T-shirts
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-gray-900 leading-[1.05] mb-4 md:mb-6 text-balance"
          >
            Threads With
            <br />
            <span className="text-gradient">Character.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-body text-base md:text-xl font-semibold text-gray-900 leading-relaxed mb-8 md:mb-10 max-w-lg"
          >
            Premium t-shirts that speak for themselves.
            Made to be worn, made to last.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <Link
              href="/products"
              className="btn-primary group text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 text-center"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#about"
              className="btn-secondary text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 text-center"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
