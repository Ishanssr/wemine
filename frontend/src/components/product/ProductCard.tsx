'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { formatINR } from '@/lib/api';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const primaryImage = product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const price = product.variants?.[0]?.price || product.basePrice;
  const hasDiscount = product.comparePrice && product.comparePrice > price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="aspect-[4/5] relative overflow-hidden bg-gray-50 mb-3">
          {primaryImage && !imgError ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.altText || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-100" />
          )}

          {hasDiscount && (
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 text-white text-[10px] font-medium">
              {Math.round(((product.comparePrice! - price) / product.comparePrice!) * 100)}% OFF
            </span>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>

        <div className="space-y-1">
          <h3 className="font-body text-sm text-gray-500 group-hover:text-gray-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1.5">
            <span className="font-body text-sm font-medium text-gray-900">
              {formatINR(price)}
            </span>
            {hasDiscount && (
              <span className="font-body text-xs text-gray-400 line-through">
                {formatINR(product.comparePrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
