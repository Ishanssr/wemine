'use client';

import { useEffect, useRef } from 'react';
// @ts-ignore
import anime from 'animejs';

interface AnimeTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimeTextReveal({ text, className = '', delay = 0 }: AnimeTextRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Split text into words, and words into letters
    const words = text.split(' ').map(word => {
      const letters = word.split('').map(letter => 
        `<span class="inline-block translate-y-[100%] opacity-0 letter-reveal">${letter}</span>`
      ).join('');
      return `<span class="inline-block overflow-hidden mr-[0.25em]">${letters}</span>`;
    });

    containerRef.current.innerHTML = words.join('');

    // Animate the letters
    anime({
      targets: containerRef.current.querySelectorAll('.letter-reveal'),
      translateY: ['100%', '0%'],
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 800,
      delay: anime.stagger(30, { start: delay }),
    });

  }, [text, delay]);

  return (
    <div className={className} ref={containerRef as any}>
      {/* Fallback for SSR and before JS runs */}
      {text}
    </div>
  );
}
