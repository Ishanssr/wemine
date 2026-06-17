'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const slides = [
  '/cotton-240gsm.png',
  '/pre-shrunk.png',
  '/fade-resistant.png',
  '/built-for-washes.png',
];

export function CraftStory() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const idx = Math.round(el.scrollLeft / w);
    if (idx !== active) setActive(idx);
  }, [active]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const total = slides.length;

  return (
    <section className="section-padding py-20 md:py-28 bg-cream-50/50 overflow-hidden">
      <div className="max-content mb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-3">
            The Difference
          </p>
          <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900 tracking-tight">
            Quality You Can Feel
          </h2>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 md:px-8 pb-4"
        style={{ scrollBehavior: 'smooth' }}
      >
        {slides.map((src, i) => {
          const dist = i - active;
          const abs = Math.abs(dist);
          const scale = 1 - abs * 0.08;
          const zIndex = total - abs;
          const isNextOnRight = dist > 0;

          return (
            <div
              key={src}
              className="snap-center shrink-0 flex items-center justify-center px-2 md:px-4"
              style={{ width: '85vw', maxWidth: 720 }}
            >
              <motion.div
                className="w-full rounded-3xl overflow-hidden bg-white shadow-sm border border-black/5"
                animate={{
                  scale: Math.max(scale, 0.7),
                  opacity: 1 - abs * 0.18,
                  rotateY: dist * -3,
                }}
                style={{ zIndex, perspective: 1200 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              >
                <div className="w-full">
                  <Image
                    src={src}
                    alt=""
                    width={1440}
                    height={900}
                    className="w-full h-auto"
                    priority={i < 2}
                  />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = scrollRef.current;
              if (!el) return;
              el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' });
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === active ? 'bg-gray-800 w-6' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
