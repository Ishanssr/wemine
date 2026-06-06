'use client';

import { create } from 'zustand';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import type { CartItem, Product, ProductVariant } from '@/types';

const CART_KEY = 'wemine_cart';

function normalizeCartItem(item: CartItem): CartItem | null {
  const product = item.product?.basePrice
    ? item.product
    : MOCK_PRODUCTS.find((mockProduct) => mockProduct.id === item.product?.id);

  if (!product) return null;

  const variant = item.variant?.size
    ? item.variant
    : product.variants?.find((productVariant) => productVariant.id === item.variant?.id) || null;

  return {
    ...item,
    product: product as Product,
    variant: variant as ProductVariant | null,
    quantity: Math.max(1, Number(item.quantity) || 1),
  };
}

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || '[]') as CartItem[];
    const normalizedItems = items
      .map(normalizeCartItem)
      .filter((item): item is CartItem => Boolean(item));

    if (JSON.stringify(normalizedItems) !== JSON.stringify(items)) {
      saveCart(normalizedItems);
    }

    return normalizedItems;
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  itemCount: number;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleSaveForLater: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  itemCount: 0,

  fetchCart: async () => {
    const items = loadCart();
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0), isLoading: false });
  },

  addItem: async (product, variant = null, quantity = 1) => {
    const safeQuantity = Math.max(1, quantity);
    const items = [...get().items];
    const existing = items.find(
      (i) => i.product.id === product.id && (variant ? i.variant?.id === variant.id : !i.variant),
    );
    if (existing) {
      existing.quantity += safeQuantity;
    } else {
      items.unshift({
        id: `cart_${Date.now()}`,
        quantity: safeQuantity,
        savedForLater: false,
        product,
        variant,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CartItem);
    }
    saveCart(items);
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  updateQuantity: async (itemId, quantity) => {
    const items = quantity <= 0
      ? get().items.filter((i) => i.id !== itemId)
      : get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    saveCart(items);
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  removeItem: async (itemId) => {
    const items = get().items.filter((i) => i.id !== itemId);
    saveCart(items);
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  toggleSaveForLater: async (itemId) => {
    const items = get().items.map((i) =>
      i.id === itemId ? { ...i, savedForLater: !i.savedForLater } : i,
    );
    saveCart(items);
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  clearCart: async () => {
    saveCart([]);
    set({ items: [], itemCount: 0 });
  },

  getTotal: () => {
    return get().items
      .filter((i) => !i.savedForLater)
      .reduce((sum, i) => sum + (i.variant?.price || i.product.basePrice || 0) * i.quantity, 0);
  },
}));
