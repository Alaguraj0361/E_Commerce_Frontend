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
    if (get().isLoading) return;

    // Clear any legacy cached static categories in sessionStorage
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('cached_categories');
      } catch {
        // Ignore storage error
      }
    }

    try {
      set({ isLoading: true });
      const res = await api.get('/categories');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const activeCategories = res.data.data.filter((c: Category) => c.isActive !== false);
        set({ categories: activeCategories, isLoading: false, hasFetched: true });
      } else {
        set({ categories: [], isLoading: false, hasFetched: true });
      }
    } catch {
      set({ categories: [], isLoading: false, hasFetched: true });
    }
  },
}));
