'use client';

import { create } from 'zustand';
import type { CartItem } from '@/types';

const CART_KEY = 'wemine_cart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
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
  addItem: (productId: string, variantId?: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleSaveForLater: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(),
  isLoading: false,
  itemCount: loadCart().reduce((s, i) => s + i.quantity, 0),

  fetchCart: async () => {
    const items = loadCart();
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0), isLoading: false });
  },

  addItem: async (productId, variantId, quantity = 1) => {
    const items = [...get().items];
    const existing = items.find(
      (i) => i.product.id === productId && (variantId ? i.variant?.id === variantId : !i.variant),
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.unshift({
        id: `cart_${Date.now()}`,
        quantity,
        savedForLater: false,
        product: { id: productId } as any,
        variant: variantId ? ({ id: variantId } as any) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CartItem);
    }
    saveCart(items);
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  updateQuantity: async (itemId, quantity) => {
    const items = get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
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
      .reduce((sum, i) => sum + (i.variant?.price || i.product.basePrice) * i.quantity, 0);
  },
}));
