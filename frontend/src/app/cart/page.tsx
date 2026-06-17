'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { formatINR } from '@/lib/api';

export default function CartPage() {
  const { items, isLoading, fetchCart, updateQuantity, removeItem, toggleSaveForLater, getTotal } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const activeItems = items.filter((i) => !i.savedForLater);
  const savedItems = items.filter((i) => i.savedForLater);
  const total = getTotal();

  if (isLoading) {
    return (
      <div className="pt-28 pb-24 max-w-4xl mx-auto px-6 md:px-12">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/30 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-heading text-xs font-medium text-glacier-600 tracking-[0.2em] uppercase mb-2">
              Cart
            </p>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900">
              Shopping Cart
            </h1>
          </div>
          <span className="font-body text-sm text-gray-500">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {activeItems.length === 0 && savedItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="font-heading text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="font-body text-gray-500 mb-8">
              Looks like you haven't added anything yet
            </p>
            <Link href="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {activeItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-surface rounded-2xl p-4 md:p-6 flex gap-4"
                >
                  <Link href={`/product/${item.product.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-glacier-100/50 flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <Image src={item.product.images[0].url} alt="" width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-glacier-300" />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-heading font-semibold text-sm text-gray-900 hover:text-glacier-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        {item.variant?.size && (
                          <p className="font-body text-xs text-gray-400 mt-0.5">
                            Size: {item.variant.size}
                          </p>
                        )}
                      </div>
                      <span className="font-heading font-semibold text-sm text-gray-900 flex-shrink-0 ml-4">
                        {formatINR((item.variant?.price || item.product.basePrice) * item.quantity)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center glass-surface rounded-xl">
                        <button
                          onClick={() => item.quantity <= 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-white/30 transition-all rounded-l-xl"
                          aria-label={`Decrease ${item.product.name} quantity`}
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-4 font-heading font-medium text-sm min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-white/30 transition-all rounded-r-xl"
                          aria-label={`Increase ${item.product.name} quantity`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSaveForLater(item.id)}
                          className="p-2 rounded-xl hover:bg-white/50 transition-all"
                          title="Save for later"
                        >
                          <Heart className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 rounded-xl hover:bg-red-50 transition-all"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {savedItems.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-heading font-semibold text-base text-gray-900 mb-4">
                    Saved for Later ({savedItems.length})
                  </h3>
                  <div className="space-y-3">
                    {savedItems.map((item) => (
                      <div key={item.id} className="glass-surface rounded-xl p-4 flex items-center gap-4 opacity-70">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-glacier-100/50 flex-shrink-0">
                          {item.product.images?.[0] && (
                            <Image src={item.product.images[0].url} alt="" width={80} height={80} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-heading font-medium text-sm text-gray-900">{item.product.name}</p>
                          <p className="font-body text-xs text-gray-400">{formatINR(item.variant?.price || item.product.basePrice)}</p>
                        </div>
                        <button
                          onClick={() => toggleSaveForLater(item.id)}
                          className="btn-ghost text-xs"
                        >
                          Move to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <div className="glass-darker rounded-2xl p-6 sticky top-28">
                <h3 className="font-heading font-semibold text-base text-gray-900 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">{formatINR(total)}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-900">{total >= 999 ? 'Free' : '₹99'}</span>
                  </div>
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900">{formatINR(total * 0.18)}</span>
                  </div>
                </div>

                <div className="border-t border-white/40 pt-4 mb-6">
                  <div className="flex justify-between font-heading font-semibold text-base">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">
                      {formatINR(total + (total >= 999 ? 0 : 99) + total * 0.18)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-primary w-full text-base py-4 mb-3"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/products"
                  className="btn-ghost w-full justify-center text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
