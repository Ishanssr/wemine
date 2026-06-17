'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const slides = [
  {
    img: '/cotton-240gsm.png',
    headline: '240 GSM',
    sub: 'Premium Cotton',
    body: 'Thick. Durable. Ultra-soft.',
  },
  {
    img: '/pre-shrunk.png',
    headline: 'Pre-Shrunk',
    sub: 'Fabric',
    body: 'Wash after wash, the fit stays true.',
  },
  {
    img: '/fade-resistant.png',
    headline: 'Fade Resistant',
    sub: 'Prints',
    body: 'Screen-printed graphics made to last.',
  },
  {
    img: '/built-for-washes.png',
    headline: 'Built for',
    sub: '100+ Washes',
    body: 'Reinforced seams. Double-stitched hems.',
  },
];

function Slide({ slide, progress, index }: { slide: typeof slides[0]; progress: any; index: number }) {
  const y = useTransform(progress, [0, 1], ['100%', '0%']);
  const scale = useTransform(progress, [0, 0.5, 1], [0.92, 0.96, 1]);
  const opacity = useTransform(progress, [0, 0.3, 1], [0, 0.7, 1]);

  return (
    <motion.div
      className="absolute inset-0 will-change-transform"
      style={{ y, scale, opacity, zIndex: index }}
    >
      <div className="relative w-full h-full">
        <Image
          src={slide.img}
          alt={`${slide.headline} ${slide.sub}`}
          fill
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-16 md:bottom-24 left-8 md:left-16 max-w-xl">
          <p className="font-heading text-white/60 text-[11px] tracking-[0.2em] uppercase mb-2">
            {slide.sub}
          </p>
          <h2 className="font-heading text-4xl md:text-7xl font-medium text-white leading-tight mb-3">
            {slide.headline}
          </h2>
          <p className="font-body text-white/70 text-sm md:text-base max-w-md leading-relaxed">
            {slide.body}
          </p>
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
    <section ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-cream-50">
        {slides.map((slide, i) => {
          const start = i / slides.length;
          const end = (i + 1) / slides.length;
          const slideProgress = useTransform(scrollYProgress, [start, end], [0, 1]);

          return (
            <Slide key={slide.img} slide={slide} progress={slideProgress} index={i} />
          );
        })}
      </div>
    </section>
  );
}
