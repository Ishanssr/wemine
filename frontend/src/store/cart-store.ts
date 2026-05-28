'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { CartItem } from '@/types';

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
  items: [],
  isLoading: false,
  itemCount: 0,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      const cart = data.data || data;
      set({
        items: cart.items || [],
        itemCount: (cart.items || []).reduce((sum: number, i: CartItem) => sum + i.quantity, 0),
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    const { data } = await api.post('/cart/items', { productId, variantId, quantity });
    await get().fetchCart();
  },

  updateQuantity: async (itemId, quantity) => {
    await api.patch(`/cart/items/${itemId}`, { quantity });
    await get().fetchCart();
  },

  removeItem: async (itemId) => {
    await api.delete(`/cart/items/${itemId}`);
    await get().fetchCart();
  },

  toggleSaveForLater: async (itemId) => {
    await api.patch(`/cart/items/${itemId}/save`);
    await get().fetchCart();
  },

  clearCart: async () => {
    await api.delete('/cart');
    set({ items: [], itemCount: 0 });
  },

  getTotal: () => {
    return get().items
      .filter((i) => !i.savedForLater)
      .reduce((sum, i) => sum + (i.variant?.price || i.product.basePrice) * i.quantity, 0);
  },
}));
