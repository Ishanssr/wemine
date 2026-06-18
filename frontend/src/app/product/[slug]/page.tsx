'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Minus, Plus, Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { api, formatINR } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await api.get(`/products/${slug}`);
      return (res.data.data || res.data) as Product;
    },
    retry: 1,
    staleTime: 300000,
  });

  const { data: related } = useQuery({
    queryKey: ['related', product?.id],
    queryFn: async () => {
      const res = await api.get(`/products/${product!.id}/related`);
      return (res.data.data || res.data) as Product[];
    },
    enabled: !!product?.id,
  });

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      
      if (product.variants && product.variants.length > 0) {
        if (!selectedSize) {
          toast.error('Please select a size');
          throw new Error('Size not selected');
        }
        const selectedVariant = product.variants.find((v) => v.size === selectedSize);
        if (!selectedVariant) {
          toast.error('Selected size variant not found');
          throw new Error('Variant not found');
        }
        await addItem(product, selectedVariant, quantity);
      } else {
        await addItem(product, null, quantity);
      }
    },
    onSuccess: () => {
      toast.success('Added to cart');
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      await api.post(`/wishlist/${product.id}`);
    },
    onSuccess: () => toast.success('Added to wishlist'),
  });

  if (isLoading) {
    return (
      <div className="pt-28 pb-24 max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-[4/5] rounded-3xl bg-white/30 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-48 bg-white/30 rounded-lg animate-pulse" />
            <div className="h-6 w-24 bg-white/30 rounded-lg animate-pulse" />
            <div className="h-24 bg-white/30 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-24 text-center">
        <p className="font-body text-gray-400">Product not found</p>
      </div>
    );
  }

  const price = product.variants?.[0]?.price || product.basePrice;
  const primaryImage = product.images?.find((i) => i.isPrimary) || product.images?.[0];

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <button
          onClick={() => router.back()}
          className="btn-ghost mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-glacier-100/30 glass-surface">
              {primaryImage && !imgError ? (
                <Image
                  src={primaryImage.url}
                  alt={primaryImage.altText || product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-glacier-200 to-glacier-300 flex items-center justify-center">
                  <span className="font-heading text-8xl font-semibold text-white/40">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img) => (
                  <button
                    key={img.id}
                    className={`flex-shrink-0 relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      img.isPrimary ? 'border-glacier-400' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags?.map((tag) => (
                <span key={tag} className="badge bg-glacier-100/50 text-gray-500">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading text-3xl font-semibold text-gray-900">
                {formatINR(price)}
              </span>
              {product.comparePrice && product.comparePrice > price && (
                <span className="font-body text-lg text-gray-400 line-through">
                  {formatINR(product.comparePrice)}
                </span>
              )}
            </div>

            {product.avgRating > 0 && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.avgRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-body text-sm text-gray-500">
                  {product.avgRating.toFixed(1)} ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            <p className="font-body text-gray-500 leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="mb-6">
              <label className="font-heading font-semibold text-sm text-gray-900 mb-3 block">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedSize(variant.size || '')}
                    disabled={variant.stock === 0}
                    className={`px-6 py-3 rounded-xl font-heading font-medium text-sm transition-all duration-200 ${
                      selectedSize === (variant.size || '')
                        ? 'bg-black text-white'
                        : variant.stock === 0
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                          : 'glass-surface text-gray-700 hover:bg-white/60'
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center glass-surface rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3.5 hover:bg-white/30 transition-all rounded-l-xl"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 font-heading font-medium text-sm min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3.5 hover:bg-white/30 transition-all rounded-r-xl"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => addToCartMutation.mutate()}
                disabled={addToCartMutation.isPending}
                className="btn-primary flex-1 text-base py-4"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => isAuthenticated ? addToWishlistMutation.mutate() : router.push('/auth/login')}
                className="btn-secondary px-5"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <div className="glass-surface rounded-xl p-4 text-center">
                <Truck className="w-5 h-5 text-glacier-600 mx-auto mb-2" />
                <p className="font-body text-xs text-gray-500">Free shipping on orders above ₹999</p>
              </div>
              <div className="glass-surface rounded-xl p-4 text-center">
                <Shield className="w-5 h-5 text-glacier-600 mx-auto mb-2" />
                <p className="font-body text-xs text-gray-500">30-day easy returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {related && related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

