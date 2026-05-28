'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { CartItem } from '@/types';

const CART_KEY = 'wemine_cart';

function loadLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
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
  items: loadLocalCart(),
  isLoading: false,
  itemCount: loadLocalCart().reduce((sum: number, i: CartItem) => sum + i.quantity, 0),

  fetchCart: async () => {
    set({ isLoading: true });
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      try {
        const { data } = await api.get('/cart');
        const cart = data.data || data;
        const items = cart.items || [];
        set({
          items,
          itemCount: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0),
          isLoading: false,
        });
        saveLocalCart(items);
        return;
      } catch {}
    }
    const items = loadLocalCart();
    set({ items, itemCount: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0), isLoading: false });
  },

  addItem: async (productId, variantId, quantity = 1) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      try {
        const { data } = await api.post('/cart/items', { productId, variantId, quantity });
        await get().fetchCart();
        return;
      } catch {}
    }
    const items = [...get().items];
    const existing = items.find(
      (i) => i.product.id === productId && (variantId ? i.variant?.id === variantId : !i.variant),
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.unshift({
        id: `local_${Date.now()}`,
        quantity,
        savedForLater: false,
        product: { id: productId } as any,
        variant: variantId ? { id: variantId } as any : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CartItem);
    }
    saveLocalCart(items);
    set({ items, itemCount: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0) });
  },

  updateQuantity: async (itemId, quantity) => {
    if (itemId.startsWith('local_')) {
      const items = get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
      saveLocalCart(items);
      set({ items, itemCount: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0) });
      return;
    }
    try {
      await api.patch(`/cart/items/${itemId}`, { quantity });
      await get().fetchCart();
    } catch {
      const items = get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
      saveLocalCart(items);
      set({ items, itemCount: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0) });
    }
  },

  removeItem: async (itemId) => {
    if (itemId.startsWith('local_')) {
      const items = get().items.filter((i) => i.id !== itemId);
      saveLocalCart(items);
      set({ items, itemCount: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0) });
      return;
    }
    try {
      await api.delete(`/cart/items/${itemId}`);
      await get().fetchCart();
    } catch {
      const items = get().items.filter((i) => i.id !== itemId);
      saveLocalCart(items);
      set({ items, itemCount: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0) });
    }
  },

  toggleSaveForLater: async (itemId) => {
    if (itemId.startsWith('local_')) {
      const items = get().items.map((i) => (i.id === itemId ? { ...i, savedForLater: !i.savedForLater } : i));
      saveLocalCart(items);
      set({ items, itemCount: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0) });
      return;
    }
    try {
      await api.patch(`/cart/items/${itemId}/save`);
      await get().fetchCart();
    } catch {
      const items = get().items.map((i) => (i.id === itemId ? { ...i, savedForLater: !i.savedForLater } : i));
      saveLocalCart(items);
      set({ items, itemCount: items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0) });
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
    } catch {}
    saveLocalCart([]);
    set({ items: [], itemCount: 0 });
  },

  getTotal: () => {
    return get().items
      .filter((i) => !i.savedForLater)
      .reduce((sum, i) => sum + (i.variant?.price || i.product.basePrice) * i.quantity, 0);
  },
}));
