import { create } from 'zustand';
import { api } from '../lib/api';
import { Category } from '../types';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  hasFetched: boolean;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  hasFetched: false,

  fetchCategories: async () => {
    // 1. Try to load immediately from sessionStorage if available
    if (typeof window !== 'undefined' && get().categories.length === 0) {
      try {
        const stored = sessionStorage.getItem('cached_categories');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            set({ categories: parsed, hasFetched: true });
          }
        }
      } catch (err) {
        // Ignore session storage error
      }
    }

    // 2. Fetch fresh categories from backend API
    try {
      set({ isLoading: true });
      const res = await api.get('/categories');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const activeCategories = res.data.data.filter((c: Category) => c.isActive !== false);
        set({ categories: activeCategories, isLoading: false, hasFetched: true });
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('cached_categories', JSON.stringify(activeCategories));
        }
      } else {
        set({ isLoading: false, hasFetched: true });
      }
    } catch (error) {
      set({ isLoading: false, hasFetched: true });
    }
  },
}));
