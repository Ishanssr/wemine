'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Minus, Plus, Heart, ShoppingCart, Star, Truck, Shield, ArrowLeft, Expand, Ruler, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import { api, formatINR } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/types';

const BLUR =
  'data:image/svg+xml;base64,' +
  Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="20"><rect width="16" height="20" fill="#e5e7eb"/></svg>').toString('base64');

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);
  const [stickyCtaVisible, setStickyCtaVisible] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const { addItem, setItems } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const ctaRef = useRef<HTMLDivElement>(null);

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

  const addToWishlistMutation = useMutation({
    mutationFn: async () => {
      if (!product) return;
      await api.post(`/wishlist/${product.id}`);
    },
    onSuccess: () => toast.success('Added to wishlist'),
  });

  const slides = useMemo(() => {
    if (!product?.images?.length) return [];
    return product.images.map((img) => ({
      src: img.url,
      alt: img.altText || product.name,
    }));
  }, [product]);

  const currentImage = product?.images?.[selectedImageIndex] || product?.images?.[0];

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyCtaVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [product]);

  const handleAddToCart = async () => {
    if (!product || isAdding) return;

    if (product.variants && product.variants.length > 0) {
      if (!selectedSize) {
        toast.error('Please select a size');
        return;
      }
      const selectedVariant = product.variants.find((v) => v.size === selectedSize);
      if (!selectedVariant) {
        toast.error('Selected size variant not found');
        return;
      }
      setIsAdding(true);
      const snapshot = useCartStore.getState().items;
      try {
        await addItem(product, selectedVariant, quantity);
        showUndoToast(snapshot);
      } finally {
        setIsAdding(false);
      }
    } else {
      setIsAdding(true);
      const snapshot = useCartStore.getState().items;
      try {
        await addItem(product, null, quantity);
        showUndoToast(snapshot);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const showUndoToast = (snapshot: any[]) => {
    toast.custom(
      (t) => (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border border-white/30 ${
            t.visible ? 'animate-enter' : 'animate-leave'
          }`}
          style={{
            background: 'rgba(15,15,15,0.95)',
            backdropFilter: 'blur(20px)',
            fontFamily: 'Manrope, sans-serif',
          }}
        >
          <span className="text-sm text-white font-body">Added to cart</span>
          <button
            onClick={() => {
              setItems(snapshot);
              toast.dismiss(t.id);
            }}
            className="text-xs font-heading font-medium tracking-[0.05em] uppercase text-white/80 hover:text-white transition-colors"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000, position: 'bottom-right' },
    );
  };

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
            <button
              onClick={() => { setLightboxIndex(selectedImageIndex); setLightboxOpen(true); }}
              className="aspect-[4/5] relative rounded-3xl overflow-hidden bg-glacier-100/30 glass-surface w-full text-left group cursor-zoom-in"
            >
              {currentImage && !imgError ? (
                <>
                  <Image
                    src={currentImage.url}
                    alt={currentImage.altText || product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL={BLUR}
                    onError={() => setImgError(true)}
                  />
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Expand className="w-4 h-4 text-gray-700" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-glacier-200 to-glacier-300 flex items-center justify-center">
                  <span className="font-heading text-8xl font-semibold text-white/40">
                    {product.name.charAt(0)}
                  </span>
                </div>
              )}
            </button>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => { setSelectedImageIndex(idx); setImgError(false); }}
                    className={`flex-shrink-0 relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      idx === selectedImageIndex ? 'border-glacier-400' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    <Image src={img.url} alt={product?.name ? `${product.name} thumbnail ${idx + 1}` : 'Product image'} fill className="object-cover" sizes="80px" />
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
              <div className="flex items-center justify-between mb-3">
                <label className="font-heading font-semibold text-sm text-gray-900">
                  Select Size
                </label>
                <button
                  onClick={() => setSizeChartOpen(true)}
                  className="font-body text-xs text-gray-400 hover:text-gray-900 flex items-center gap-1 transition-colors"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Size Guide
                </button>
              </div>
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

            <div ref={ctaRef} className="flex items-center gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="btn-primary flex-1 text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {isAdding ? 'Adding...' : 'Add to Cart'}
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

      {sizeChartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={() => setSizeChartOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl"
          >
            <button
              onClick={() => setSizeChartOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-heading text-lg font-semibold text-gray-900 mb-6">Size Guide</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="font-heading text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">Size</th>
                    <th className="font-heading text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">Chest (in)</th>
                    <th className="font-heading text-xs font-medium text-gray-400 uppercase tracking-wider pb-3 pr-4">Length (in)</th>
                    <th className="font-heading text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { size: 'S', chest: '38', length: '27', shoulder: '17' },
                    { size: 'M', chest: '40', length: '28', shoulder: '18' },
                    { size: 'L', chest: '42', length: '29', shoulder: '19' },
                    { size: 'XL', chest: '44', length: '30', shoulder: '20' },
                    { size: 'XXL', chest: '46', length: '31', shoulder: '21' },
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-gray-50">
                      <td className="font-heading text-sm font-medium text-gray-900 py-3 pr-4">{row.size}</td>
                      <td className="font-body text-sm text-gray-600 py-3 pr-4">{row.chest}</td>
                      <td className="font-body text-sm text-gray-600 py-3 pr-4">{row.length}</td>
                      <td className="font-body text-sm text-gray-600 py-3">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="font-body text-xs text-gray-400 mt-4">
              Measurements are in inches. Fit may vary by style. For the best fit, measure a similar garment you own.
            </p>
          </motion.div>
        </motion.div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
        carousel={{ finite: true }}
        styles={{ container: { backgroundColor: 'rgba(0,0,0,0.95)' } }}
      />

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
          stickyCtaVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-cream-50/95 backdrop-blur-xl border-t border-gray-200/60 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-heading text-lg font-semibold text-gray-900">
              {formatINR(product?.variants?.[0]?.price || product?.basePrice || 0)}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="btn-primary flex-1 text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

