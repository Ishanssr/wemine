'use client';

import { create } from 'zustand';
import { api } from '@/lib/api';
import type { CartItem, Product, ProductVariant } from '@/types';

const CART_KEY = 'wemine_cart';

function loadLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function clearLocalCart() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
}

function hasToken(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('accessToken');
}

function toCartItem(raw: any): CartItem {
  return {
    id: raw.id,
    product: {
      id: raw.product?.id ?? '',
      name: raw.product?.name ?? '',
      slug: raw.product?.slug ?? '',
      description: raw.product?.description ?? '',
      basePrice: raw.product?.basePrice ?? raw.product?.price ?? 0,
      comparePrice: raw.product?.comparePrice,
      sku: raw.product?.sku ?? '',
      isActive: raw.product?.isActive ?? true,
      isFeatured: raw.product?.isFeatured ?? false,
      tags: raw.product?.tags ?? [],
      totalStock: raw.product?.totalStock ?? 0,
      avgRating: raw.product?.avgRating ?? 0,
      reviewCount: raw.product?.reviewCount ?? 0,
      images: raw.product?.images ?? [],
      variants: raw.product?.variants ?? [],
      categories: raw.product?.categories ?? [],
      reviews: raw.product?.reviews ?? [],
      relatedProducts: raw.product?.relatedProducts,
    },
    variant: raw.variant ? {
      id: raw.variant.id,
      name: raw.variant.name ?? '',
      size: raw.variant.size,
      color: raw.variant.color,
      colorHex: raw.variant.colorHex,
      price: raw.variant.price,
      stock: raw.variant.stock ?? 0,
      isActive: raw.variant.isActive ?? true,
    } : null,
    quantity: raw.quantity ?? 1,
    savedForLater: raw.savedForLater ?? false,
  };
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  itemCount: number;
  isDrawerOpen: boolean;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleSaveForLater: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
  setItems: (items: CartItem[]) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  itemCount: 0,
  isDrawerOpen: false,

  fetchCart: async () => {
    set({ isLoading: true });

    if (!hasToken()) {
      const items = loadLocalCart();
      set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0), isLoading: false });
      return;
    }

    try {
      const localItems = loadLocalCart();

      if (localItems.length > 0) {
        await Promise.all(
          localItems.map((item) =>
            api.post('/cart/items', {
              productId: item.product.id,
              variantId: item.variant?.id ?? undefined,
              quantity: item.quantity,
            }),
          ),
        );
        clearLocalCart();
      }

      const { data: cart } = await api.get('/cart');
      const items = (cart.items ?? []).map(toCartItem);
      set({ items, itemCount: items.reduce((s: number, i: CartItem) => s + i.quantity, 0), isLoading: false });
    } catch {
      const items = loadLocalCart();
      set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0), isLoading: false });
    }
  },

  addItem: async (product, variant = null, quantity = 1) => {
    const safeQuantity = Math.max(1, quantity);
    const items = [...get().items];
    const existingIdx = items.findIndex(
      (i) => i.product.id === product.id && (variant ? i.variant?.id === variant.id : !i.variant),
    );

    if (hasToken()) {
      const tempId = `temp_${Date.now()}`;

      if (existingIdx >= 0) {
        items[existingIdx] = { ...items[existingIdx], quantity: items[existingIdx].quantity + safeQuantity };
      } else {
        items.unshift({
          id: tempId,
          product,
          variant: variant ?? null,
          quantity: safeQuantity,
          savedForLater: false,
        } as CartItem);
      }
      set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });

      try {
        const { data } = await api.post('/cart/items', {
          productId: product.id,
          variantId: variant?.id ?? undefined,
          quantity: safeQuantity,
        });
        const newItem = toCartItem(data);
        const synced = get().items.map((i) => (i.id === tempId ? newItem : i));
        set({ items: synced, itemCount: synced.reduce((s, i) => s + i.quantity, 0) });
      } catch {
        const reverted = get().items.filter((i) => i.id !== tempId);
        set({ items: reverted, itemCount: reverted.reduce((s, i) => s + i.quantity, 0) });
      }
      return;
    }

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
    saveLocalCart(items);
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  updateQuantity: async (itemId, quantity) => {
    if (hasToken()) {
      try {
        if (quantity <= 0) {
          await api.delete(`/cart/items/${itemId}`);
        } else {
          await api.patch(`/cart/items/${itemId}`, { quantity });
        }
      } catch {}
      const items = get().items.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i,
      ).filter((i) => i.quantity > 0);
      set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
      return;
    }

    const items = quantity <= 0
      ? get().items.filter((i) => i.id !== itemId)
      : get().items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
    saveLocalCart(items);
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  removeItem: async (itemId) => {
    if (hasToken()) {
      try { await api.delete(`/cart/items/${itemId}`); } catch {}
    }
    const items = get().items.filter((i) => i.id !== itemId);
    if (!hasToken()) saveLocalCart(items);
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  toggleSaveForLater: async (itemId) => {
    if (hasToken()) {
      await api.patch(`/cart/items/${itemId}/save`);
    }
    const items = get().items.map((i) =>
      i.id === itemId ? { ...i, savedForLater: !i.savedForLater } : i,
    );
    if (!hasToken()) saveLocalCart(items);
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  clearCart: async () => {
    if (hasToken()) {
      await api.delete('/cart');
    }
    saveLocalCart([]);
    set({ items: [], itemCount: 0 });
  },

  getTotal: () => {
    return get().items
      .filter((i) => !i.savedForLater)
      .reduce((sum, i) => sum + (i.variant?.price || i.product.basePrice || 0) * i.quantity, 0);
  },

  setItems: (items: CartItem[]) => {
    set({ items, itemCount: items.reduce((s, i) => s + i.quantity, 0) });
  },

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));
