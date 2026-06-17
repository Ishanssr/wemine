'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const slides = [
  '/cotton-240gsm.png',
  '/pre-shrunk.png',
  '/fade-resistant.png',
  '/built-for-washes.png',
];

export function CraftStory() {
  return (
    <section className="section-padding py-20 md:py-28 bg-cream-50/50">
      <div className="max-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-3">
            The Difference
          </p>
          <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900 tracking-tight">
            Quality You Can Feel
          </h2>
        </motion.div>

        <div className="space-y-8 md:space-y-12">
          {slides.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
              className="w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-white shadow-sm border border-black/5"
            >
              <div className="w-full">
                <Image
                  src={src}
                  alt=""
                  width={1600}
                  height={900}
                  className="w-full h-auto"
                  priority={i < 2}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
