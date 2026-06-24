'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Minus, Plus, Trash2, X } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatINR } from '@/lib/api';

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, fetchCart, updateQuantity, removeItem, getTotal } = useCartStore();

  useEffect(() => { if (isDrawerOpen) fetchCart(); }, [isDrawerOpen, fetchCart]);

  const activeItems = items.filter((i) => !i.savedForLater);
  const total = getTotal();

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeDrawer();
  }, [closeDrawer]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen, onKeyDown]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-cream-50 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-black/5">
              <h2 className="font-heading text-base font-semibold text-gray-900 tracking-[0.05em] uppercase">
                Cart
              </h2>
              <button
                onClick={closeDrawer}
                className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-all rounded-xl"
              >
                <X className="w-5 h-5 text-gray-900" />
              </button>
            </div>

            {activeItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <ShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
                <p className="font-heading text-sm font-medium text-gray-900 mb-1">
                  Your cart is empty
                </p>
                <p className="font-body text-xs text-gray-400 mb-6">
                  Looks like you haven't added anything yet
                </p>
                <Link
                  href="/products"
                  onClick={closeDrawer}
                  className="btn-primary text-sm py-3"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                  {activeItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-2xl bg-white/60 border border-white/80"
                    >
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeDrawer}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-glacier-100/50 flex-shrink-0"
                      >
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-glacier-300" />
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeDrawer}
                          className="font-heading text-xs font-semibold text-gray-900 hover:text-glacier-600 transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        {item.variant?.size && (
                          <p className="font-body text-[10px] text-gray-400 mt-0.5">
                            Size: {item.variant.size}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center glass-surface rounded-lg">
                            <button
                              onClick={() => item.quantity <= 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-white/30 transition-all rounded-l-lg"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 font-heading font-medium text-xs min-w-[1.5rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-white/30 transition-all rounded-r-lg"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-xs font-semibold text-gray-900">
                              {formatINR((item.variant?.price || item.product.basePrice) * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-black/5 px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs text-gray-500">Subtotal</span>
                    <span className="font-heading text-sm font-semibold text-gray-900">
                      {formatINR(total)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="btn-primary w-full text-sm py-3 justify-center"
                  >
                    Checkout — {formatINR(total)}
                  </Link>
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="block text-center font-body text-[11px] text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-[0.05em]"
                  >
                    View Full Cart
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
