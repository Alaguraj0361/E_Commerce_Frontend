import { create } from 'zustand';
import { api } from '../lib/api';
import { Product } from '../types';
import { toast } from 'sonner';

interface WishlistState {
  products: Product[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  products: [],
  isLoading: false,

  fetchWishlist: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/wishlist');
      if (res.data?.success && res.data.data?.products) {
        set({ products: res.data.data.products, isLoading: false });
      } else {
        set({ products: [], isLoading: false });
      }
    } catch (error) {
      set({ products: [], isLoading: false });
    }
  },

  isInWishlist: (productId: string) => {
    return get().products.some((p) => p._id === productId);
  },

  toggleWishlist: async (product: Product) => {
    const isPresent = get().isInWishlist(product._id);
    if (isPresent) {
      try {
        set({ products: get().products.filter((p) => p._id !== product._id) });
        await api.delete(`/wishlist/${product._id}`);
        toast.info(`Removed "${product.name}" from wishlist`);
      } catch (error: any) {
        toast.error('Failed to update wishlist');
        get().fetchWishlist();
      }
    } else {
      try {
        set({ products: [...get().products, product] });
        await api.post(`/wishlist/${product._id}`);
        toast.success(`Saved "${product.name}" to wishlist`);
      } catch (error: any) {
        toast.error('Please login to save to your wishlist');
        get().fetchWishlist();
      }
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      set({ products: get().products.filter((p) => p._id !== productId) });
      await api.delete(`/wishlist/${productId}`);
      toast.info('Item removed from wishlist');
    } catch (error: any) {
      toast.error('Failed to remove item from wishlist');
      get().fetchWishlist();
    }
  },
}));
