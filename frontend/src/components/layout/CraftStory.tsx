'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const slides = [
  { src: '/cotton-240gsm.png', alt: 'WEMINE 240 GSM premium cotton fabric detail' },
  { src: '/pre-shrunk.png', alt: 'Pre-shrunk cotton t-shirt fabric — stays true to size' },
  { src: '/fade-resistant.png', alt: 'Fade-resistant print on WEMINE premium t-shirt' },
  { src: '/built-for-washes.png', alt: 'Durable t-shirt fabric designed for repeated washes' },
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
    <section className="py-16 md:py-24 bg-white overflow-hidden border-t border-black/10">
      <div className="max-content mb-10 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-3">
              The Difference
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-medium text-black tracking-tight uppercase">
              Worth Every Wear
            </h2>
          </div>
          
          <div className="gap-2 pb-1 hidden md:flex">
             <button
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const prev = Math.max(0, active - 1);
                const card = el.querySelector<HTMLElement>(`[data-index="${prev}"]`);
                if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
              className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const next = Math.min(slides.length - 1, active + 1);
                const card = el.querySelector<HTMLElement>(`[data-index="${next}"]`);
                if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }}
              className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
              aria-label="Next slide"
            >
              →
            </button>
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-6 md:px-12 gap-4 pb-8"
        style={{ scrollBehavior: 'smooth' }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            data-index={i}
            className="snap-center shrink-0 w-[85vw] sm:w-[65vw] md:w-[50vw] lg:w-[45vw] max-w-[800px]"
          >
            <div className="w-full bg-white border border-black/10 overflow-hidden relative aspect-[4/3] md:aspect-[16/10] group">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 85vw, 50vw"
                priority={i < 2}
              />
            </div>
          </div>
        ))}
        <div className="shrink-0 w-6 md:w-12" />
      </div>

      <div className="flex justify-center gap-1 mt-4 px-6">
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
            className={`h-1 transition-all duration-300 ${
              i === active ? 'bg-black w-8' : 'bg-black/10 w-4 hover:bg-black/30'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
