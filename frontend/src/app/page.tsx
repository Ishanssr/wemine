'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroSection } from '@/components/layout/HeroSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section id="products" className="section-padding py-20 md:py-28">
        <div className="max-content">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900 tracking-tight">
                Our Collection
              </h2>
              <p className="font-body text-sm text-gray-400 mt-2 tracking-[0.05em] uppercase">
                Premium Minimal Wear
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-1 font-heading text-[11px] font-medium text-gray-400 tracking-[0.1em] uppercase hover:text-gray-900 transition-colors"
            >
              View All
            </Link>
          </motion.div>

          <ProductGrid />

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center md:hidden"
          >
            <Link href="/products" className="btn-secondary">
              View All
            </Link>
          </motion.div>
        </div>
      </section>

      <AboutSection />

      <FeaturesSection />
    </>
  );
}

function AboutSection() {
  return (
    <section id="about" className="section-padding py-20 md:py-28 bg-black/5 relative overflow-hidden">
      {/* Animated mountain silhouette */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg className="w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          <motion.path
            d="M0,600 L200,350 L400,500 L600,200 L800,450 L1000,150 L1200,400 L1440,250 L1440,800 L0,800 Z"
            fill="currentColor"
            initial={{ d: "M0,600 L200,500 L400,550 L600,450 L800,500 L1000,400 L1200,500 L1440,450 L1440,800 L0,800 Z" }}
            whileInView={{ d: "M0,600 L200,350 L400,500 L600,200 L800,450 L1000,150 L1200,400 L1440,250 L1440,800 L0,800 Z" }}
            viewport={{ once: true }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M0,700 L300,500 L500,650 L700,400 L900,600 L1100,350 L1300,550 L1440,450 L1440,800 L0,800 Z"
            fill="currentColor"
            opacity="0.6"
            initial={{ d: "M0,700 L300,600 L500,680 L700,550 L900,650 L1100,500 L1300,600 L1440,550 L1440,800 L0,800 Z" }}
            whileInView={{ d: "M0,700 L300,500 L500,650 L700,400 L900,600 L1100,350 L1300,550 L1440,450 L1440,800 L0,800 Z" }}
            viewport={{ once: true }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="max-content relative">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-4">
              About WEMINE
            </p>
            <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900 mb-6 tracking-tight">
              Born from the Mountains
            </h2>
            <div className="space-y-4 font-body text-sm text-gray-500 leading-relaxed">
              <p>
                WEMINE was born on a cold morning above the treeline, watching the sun
                paint the peaks in gold. That moment of stillness and raw beauty became
                our north star — every piece we make carries a piece of that quiet
                grandeur.
              </p>
              <p>
              We work with pure cottons sourced from the valleys of Himachal,
              spun and woven into garments that feel like they belong on your body.
              No logos, no noise — just clean lines, thoughtful fits, and fabric that
              only gets better with time.
              </p>
              <p>
              Born from the trails of Himachal, WEMINE is a tribute to the mountain
              spirit — the pull of the trail, the calm at the summit, and the
              quiet confidence of wearing something real.
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <Link href="/products" className="btn-primary">
                Explore Collection
              </Link>
              <Link href="/contact" className="btn-secondary">
                Get in Touch
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            {/* Cotton/mountain imagery */}
            <div className="aspect-[4/3] overflow-hidden relative">
              <img
                src="/hero2.png"
                alt="Mountain peak at sunrise"
                className="w-full h-full object-cover object-center"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              {/* Floating cotton particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${10 + (i % 5) * 15}%`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: [0, 0.6, 0], y: [20, -20, -60] }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 3 + i * 0.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: 'Premium Materials', desc: '100% organic cotton, ethically sourced' },
    { title: 'Minimal Design', desc: 'Clean aesthetics inspired by alpine peaks' },
    { title: 'Built to Last', desc: 'Premium construction for everyday wear' },
    { title: 'Eco-Conscious', desc: 'Sustainable packaging and practices' },
  ];

  return (
    <section className="section-padding py-20 md:py-28">
      <div className="max-content">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-heading text-[10px] font-medium text-gray-400 tracking-[0.15em] uppercase mb-3">
            Why WEMINE
          </p>
          <h2 className="font-heading text-2xl md:text-3xl font-medium text-gray-900 tracking-tight">
            Crafted for the Journey
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center"
            >
              <h3 className="font-heading text-xs font-medium text-gray-900 mb-2 tracking-[0.05em] uppercase">
                {feature.title}
              </h3>
              <p className="font-body text-xs text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
