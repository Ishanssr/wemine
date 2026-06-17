'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const slides = [
  {
    img: '/cotton-240gsm.png',
    headline: '240 GSM Premium Cotton',
    body: 'Thick, durable, ultra-soft fabric that holds its shape.',
  },
  {
    img: '/pre-shrunk.png',
    headline: 'Pre-Shrunk Fabric',
    body: 'Wash after wash, the fit stays true.',
  },
  {
    img: '/fade-resistant.png',
    headline: 'Fade Resistant Prints',
    body: 'Screen-printed graphics made to last.',
  },
  {
    img: '/built-for-washes.png',
    headline: 'Built for 100+ Washes',
    body: 'Reinforced seams. Double-stitched hems.',
  },
];

function Card({ slide, progress, index }: { slide: typeof slides[0]; progress: any; index: number }) {
  const isFirst = index === 0;
  const y = useTransform(progress, [0, 1], isFirst ? ['0%', '0%'] : ['120%', '0%']);
  const scale = useTransform(progress, [0, 1], isFirst ? [1, 1] : [0.9, 1]);
  const opacity = useTransform(progress, [0, 1], isFirst ? [1, 1] : [0, 1]);

  return (
    <motion.div
      className="absolute inset-0 flex items-start justify-center pt-12 md:pt-20 will-change-transform"
      style={{ y, scale, opacity, zIndex: index }}
    >
      <div className="w-full max-w-5xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-5 gap-6 md:gap-10 items-center bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5">
          <div className="md:col-span-3 relative aspect-[4/5] md:aspect-auto md:h-[65vh] min-h-[320px] bg-glacier-50">
            <Image
              src={slide.img}
              alt={slide.headline}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
          <div className="md:col-span-2 px-6 md:px-0 md:pr-10 pb-8 md:pb-0">
            <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-3">
              The Difference
            </p>
            <h2 className="font-heading text-xl md:text-3xl font-medium text-gray-900 leading-tight mb-4">
              {slide.headline}
            </h2>
            <p className="font-body text-sm text-gray-500 leading-relaxed">
              {slide.body}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CraftStory() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

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
      </div>

      <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
        <div className="sticky top-24 h-[70vh] overflow-hidden">
          {slides.map((slide, i) => {
            const start = i / slides.length;
            const end = (i + 1) / slides.length;
            const slideProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

            return (
              <Card key={slide.img} slide={slide} progress={slideProgress} index={i} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
