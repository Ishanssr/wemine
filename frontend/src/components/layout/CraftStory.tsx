'use client';

import { useRef, useState, useEffect } from 'react';
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const cards = el.querySelectorAll<HTMLElement>('[data-index]');
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-cream-50/50 overflow-hidden">
      <div className="max-content mb-8">
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
            Worth Every Wear
          </h2>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="shrink-0" style={{ width: 'calc(50vw - 1rem)' }} />

        {slides.map((src, i) => {
          const dist = i - active;
          const abs = Math.abs(dist);
          const scale = 1 - abs * 0.07;

          return (
            <div
              key={src}
              data-index={i}
              className="snap-center shrink-0 flex items-center justify-center px-2"
              style={{ width: '80vw', maxWidth: 680 }}
            >
              <motion.div
                className="w-full rounded-3xl overflow-hidden bg-white shadow-sm border border-black/5"
                animate={{
                  scale: Math.max(scale, 0.72),
                  opacity: 1 - abs * 0.15,
                }}
                style={{ perspective: 1200 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <Image
                  src={src}
                  alt=""
                  width={1440}
                  height={900}
                  className="w-full h-auto"
                  priority={i < 2}
                />
              </motion.div>
            </div>
          );
        })}

        <div className="shrink-0" style={{ width: 'calc(50vw - 1rem)' }} />
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = scrollRef.current;
              if (!el) return;
              const card = el.querySelector<HTMLElement>(`[data-index="${i}"]`);
              if (card) {
                card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }
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
