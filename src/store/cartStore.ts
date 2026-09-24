import { create } from 'zustand';
import { api } from '../lib/api';
import { CartItem, Coupon } from '../types';
import { getGuestId } from '../lib/utils';
import { toast } from 'sonner';

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  appliedCoupon: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  } | null;
  setIsCartOpen: (open: boolean) => void;
  fetchCart: () => Promise<void>;
  addItem: (item: {
    productId: string;
    variantId?: string;
    quantity?: number;
    name: string;
    image: string;
    price: number;
    sku?: string;
    attributes?: Record<string, any>;
  }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  mergeGuestCart: () => Promise<void>;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingFee: () => number;
  getTax: () => number;
  getTotal: () => number;
  getTotalItemsCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,
  isLoading: false,
  appliedCoupon: null,

  setIsCartOpen: (open) => set({ isCartOpen: open }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/cart');
      if (res.data?.success && res.data.data?.items) {
        set({ items: res.data.data.items, isLoading: false });
      } else {
        set({ items: [], isLoading: false });
      }
    } catch (error) {
      set({ items: [], isLoading: false });
    }
  },

  addItem: async (itemData) => {
    try {
      const guestId = getGuestId();
      const res = await api.post('/cart', {
        productId: itemData.productId,
        variantId: itemData.variantId,
        quantity: itemData.quantity || 1,
        guestId,
      });

      if (res.data?.success && res.data.data?.items) {
        set({ items: res.data.data.items, isCartOpen: true });
        toast.success(`Added "${itemData.name}" to cart`);
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to add item to cart');
    }
  },

  updateQuantity: async (itemId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity });
      if (res.data?.success && res.data.data?.items) {
        set({ items: res.data.data.items });
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to update quantity');
    }
  },

  removeItem: async (itemId) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      if (res.data?.success && res.data.data?.items) {
        set({ items: res.data.data.items });
        toast.info('Item removed from cart');
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to remove item');
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart');
      set({ items: [], appliedCoupon: null });
    } catch (error: any) {
      toast.error('Failed to clear cart');
    }
  },

  applyCoupon: async (code: string) => {
    const subtotal = get().getSubtotal();
    if (subtotal === 0) {
      toast.error('Your cart is empty');
      return false;
    }
    try {
      const res = await api.post('/coupons/validate', {
        code,
        orderTotal: subtotal,
      });

      if (res.data?.success && res.data.data) {
        const { discountType, discountValue, discountAmount } = res.data.data;
        set({
          appliedCoupon: {
            code,
            discountType,
            discountValue,
            discountAmount,
          },
        });
        toast.success(`Coupon ${code} applied successfully!`);
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.customMessage || 'Invalid coupon code');
      return false;
    }
  },

  removeCoupon: () => {
    set({ appliedCoupon: null });
    toast.info('Coupon removed');
  },

  mergeGuestCart: async () => {
    try {
      const guestId = getGuestId();
      const res = await api.post('/cart/merge', { guestId });
      if (res.data?.success && res.data.data?.items) {
        set({ items: res.data.data.items });
      }
    } catch (error) {
      // Ignore
    }
  },

  getSubtotal: () => {
    const { items } = get();
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return Math.round(sum * 100) / 100;
  },

  getDiscount: () => {
    const { appliedCoupon } = get();
    if (!appliedCoupon) return 0;
    const subtotal = get().getSubtotal();
    let disc = 0;
    if (appliedCoupon.discountType === 'percentage') {
      disc = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      disc = Math.min(appliedCoupon.discountValue, subtotal);
    }
    return Math.round(disc * 100) / 100;
  },

  getShippingFee: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const discounted = Math.max(0, subtotal - discount);
    if (discounted === 0) return 0;
    return discounted > 1499 ? 0 : 99;
  },

  getTax: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const discounted = Math.max(0, subtotal - discount);
    return Math.round(discounted * 0.18 * 100) / 100;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().getDiscount();
    const shipping = get().getShippingFee();
    const tax = get().getTax();
    return Math.max(0, Math.round((subtotal - discount + shipping + tax) * 100) / 100);
  },

  getTotalItemsCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
}));
