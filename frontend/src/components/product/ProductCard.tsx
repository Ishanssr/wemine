'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import { formatINR } from '@/lib/api';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

const BLUR =
  'data:image/svg+xml;base64,' +
  Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="20"><rect width="16" height="20" fill="#e5e7eb"/></svg>').toString('base64');

export function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const secondaryImage = product.images?.[1];
  const displayImage = isHovered && secondaryImage ? secondaryImage : primaryImage;
  const price = product.variants?.[0]?.price || product.basePrice;
  const hasDiscount = product.comparePrice && product.comparePrice > price;

  const isDesign = product.slug?.startsWith('design-');
  const href = isDesign
    ? `/designs/${product.id.replace('design-', '')}`
    : `/product/${product.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        href={href}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="aspect-[4/5] relative overflow-hidden bg-gray-100 mb-4">
          {displayImage && !imgError ? (
            <>
              <Image
                key={isHovered && secondaryImage ? 'secondary' : 'primary'}
                src={displayImage.url}
                alt={displayImage.altText || product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={`object-cover transition-opacity duration-700 ease-out ${
                  imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'
                } group-hover:scale-[1.03]`}
                placeholder="blur"
                blurDataURL={BLUR}
                priority={priority}
                onError={() => setImgError(true)}
                onLoad={() => setImgLoaded(true)}
              />
              {!imgLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

          {isDesign ? (
            <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur text-black text-[10px] font-heading font-medium tracking-[0.08em] uppercase rounded-full">
              Launching Soon
            </span>
          ) : hasDiscount ? (
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-black text-white text-[9px] font-heading font-medium tracking-[0.05em] uppercase">
              {Math.round(((product.comparePrice! - price) / product.comparePrice!) * 100)}% OFF
            </span>
          ) : null}
        </div>

        <div className="space-y-1">
          <h3 className="font-heading text-[11px] font-medium text-gray-900 tracking-[0.05em] uppercase line-clamp-1">
            {product.name}
          </h3>
          {isDesign ? (
            <p className="font-body text-[11px] text-gray-400 tracking-[0.05em] uppercase">
              Launching Soon
            </p>
          ) : price > 0 ? (
            <div className="flex items-baseline gap-1.5">
              <span className="font-body text-xs text-gray-500">
                {formatINR(price)}
              </span>
              {hasDiscount && (
                <span className="font-body text-[10px] text-gray-300 line-through">
                  {formatINR(product.comparePrice!)}
                </span>
              )}
            </div>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}
