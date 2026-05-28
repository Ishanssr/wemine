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

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="bg-white border border-gray-100">
          <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
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
          </div>

          <div className="px-5 py-4">
            <h3 className="font-heading font-medium text-[13px] text-gray-900 tracking-wide uppercase">
              {product.name}
            </h3>
            <p className="font-body text-[11px] text-gray-400 mt-1.5 line-clamp-1 tracking-wide">
              {product.shortDesc || product.description}
            </p>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="font-heading text-sm text-gray-900 tracking-wider">
                {formatINR(price)}
              </span>
              {product.comparePrice && product.comparePrice > price && (
                <span className="font-body text-[11px] text-gray-300 line-through tracking-wider">
                  {formatINR(product.comparePrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
