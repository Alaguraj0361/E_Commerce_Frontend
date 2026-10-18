'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  Star,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Product, Category, Brand } from '../../types';
import { ProductCard } from '../../components/product/ProductCard';
import { formatCurrency } from '../../lib/utils';
import { LotusIcon } from '../../components/ui/BrandLogo';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
  const [hasDiscount, setHasDiscount] = useState(searchParams.get('hasDiscount') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Synchronize state whenever URL search parameters change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSearchQuery(searchParams.get('search') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setRating(searchParams.get('rating') || '');
    setInStock(searchParams.get('inStock') === 'true');
    setHasDiscount(searchParams.get('hasDiscount') === 'true');
    setSort(searchParams.get('sort') || 'featured');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };

  const handlePricePreset = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');
    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };

  // Load Categories & Brands from API
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands'),
        ]);
        if (catRes.data?.success && Array.isArray(catRes.data.data)) {
          setCategories(catRes.data.data);
        }
        if (brandRes.data?.success && Array.isArray(brandRes.data.data)) {
          setBrands(brandRes.data.data);
        }
      } catch (error) {
        console.error('Failed to load categories/brands:', error);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products based on live filters
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.set('category', selectedCategory);
        if (selectedBrand) params.set('brand', selectedBrand);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (rating) params.set('rating', rating);
        if (inStock) params.set('inStock', 'true');
        if (hasDiscount) params.set('hasDiscount', 'true');
        if (sort) params.set('sort', sort);
        if (searchQuery) params.set('search', searchQuery);
        params.set('page', page.toString());
        params.set('limit', '12');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data?.success && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
          if (res.data.meta) {
            setTotalPages(res.data.meta.totalPages || 1);
            setTotalProducts(res.data.meta.total || res.data.data.length);
          } else {
            setTotalProducts(res.data.data.length);
            setTotalPages(1);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    rating,
    inStock,
    hasDiscount,
    sort,
    searchQuery,
    page,
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setInStock(false);
    setHasDiscount(false);
    setSearchQuery('');
    setSort('featured');
    setPage(1);
    router.push('/shop');
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    rating,
    inStock,
    hasDiscount,
    searchQuery,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. HERO HEADER (Deep Maroon #4A0E17 & Gold Accents) */}
      <section className="relative overflow-hidden bg-[#4A0E17] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#380B11]">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] sm:text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-3.5 h-3 text-[#D4AF37]" />
            <span>Curated Handlooms & Couture</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight capitalize">
            {selectedCategory ? `${selectedCategory.replace(/-/g, ' ')} Collection` : 'All Collections'}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed">
            Discover our handcrafted artisanal sarees, pure Kanchivaram silks, soft cottons, and festive ensembles.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:underline text-zinc-300">Home</Link>
            <span className="text-zinc-500">/</span>
            <span className="text-white font-medium">Shop</span>
            {selectedCategory && (
              <>
                <span className="text-zinc-500">/</span>
                <span className="text-[#D4AF37] font-medium capitalize">{selectedCategory.replace(/-/g, ' ')}</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. MAIN SHOP CONTENT */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-10">
        {/* Results Count & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E8E2D5] gap-4">
          <p className="text-xs text-zinc-600">
            Showing <strong className="text-zinc-900 font-bold">{products.length}</strong> of{' '}
            <strong className="text-zinc-900 font-bold">{totalProducts}</strong> handcrafted items
          </p>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#4A0E17] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-[#E8E2D5] rounded-full px-4 py-2 pr-8 text-xs font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#4A0E17] shadow-xs cursor-pointer"
              >
                <option value="featured">Featured Collection</option>
                <option value="newest">Newest Releases</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* View Mode Switcher */}
            <div className="hidden sm:flex items-center bg-white border border-[#E8E2D5] rounded-full p-1 shadow-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'grid' ? 'bg-[#4A0E17] text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === 'list' ? 'bg-[#4A0E17] text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
                aria-label="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white rounded-2xl border border-[#E8E2D5] p-5 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D5]">
                <h3 className="font-serif font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#4A0E17]" />
                  <span>Filter Collections</span>
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-[#4A0E17] hover:underline font-medium"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Categories
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategorySelect('')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      !selectedCategory
                        ? 'bg-[#4A0E17] text-white font-semibold'
                        : 'text-zinc-700 hover:bg-[#FAF7F2]'
                    }`}
                  >
                    All Sarees & Attire
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => handleCategorySelect(c.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === c.slug
                          ? 'bg-[#4A0E17] text-white font-semibold'
                          : 'text-zinc-700 hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter Presets matching Mockup */}
              <div className="space-y-2 pt-3 border-t border-[#E8E2D5]">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Shop by Price
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => handlePricePreset('', '799')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      maxPrice === '799' && !minPrice
                        ? 'border-[#4A0E17] bg-[#4A0E17] text-white font-bold'
                        : 'border-[#E8E2D5] bg-[#FAF7F2] text-zinc-700 hover:border-[#4A0E17]'
                    }`}
                  >
                    Under ₹799
                  </button>
                  <button
                    onClick={() => handlePricePreset('800', '1499')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      minPrice === '800' && maxPrice === '1499'
                        ? 'border-[#4A0E17] bg-[#4A0E17] text-white font-bold'
                        : 'border-[#E8E2D5] bg-[#FAF7F2] text-zinc-700 hover:border-[#4A0E17]'
                    }`}
                  >
                    ₹800 – ₹1,499
                  </button>
                  <button
                    onClick={() => handlePricePreset('1500', '2999')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      minPrice === '1500' && maxPrice === '2999'
                        ? 'border-[#4A0E17] bg-[#4A0E17] text-white font-bold'
                        : 'border-[#E8E2D5] bg-[#FAF7F2] text-zinc-700 hover:border-[#4A0E17]'
                    }`}
                  >
                    ₹1,500 – ₹2,999
                  </button>
                  <button
                    onClick={() => handlePricePreset('3000', '')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      minPrice === '3000' && !maxPrice
                        ? 'border-[#4A0E17] bg-[#4A0E17] text-white font-bold'
                        : 'border-[#E8E2D5] bg-[#FAF7F2] text-zinc-700 hover:border-[#4A0E17]'
                    }`}
                  >
                    ₹3,000+
                  </button>
                </div>
              </div>

              {/* Additional Options: In Stock & Discounts */}
              <div className="space-y-2 pt-3 border-t border-[#E8E2D5]">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Availability & Offers
                </h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="rounded text-[#4A0E17] focus:ring-[#4A0E17] w-4 h-4"
                    />
                    <span>In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-700">
                    <input
                      type="checkbox"
                      checked={hasDiscount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                      className="rounded text-[#4A0E17] focus:ring-[#4A0E17] w-4 h-4"
                    />
                    <span>Special Offers & Discounts</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid Column (3 cols on desktop) */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-[#E8E2D5] p-3 space-y-3 animate-pulse"
                  >
                    <div className="aspect-[3/4] bg-zinc-200 rounded-xl" />
                    <div className="h-4 bg-zinc-200 rounded w-3/4" />
                    <div className="h-3 bg-zinc-200 rounded w-1/2" />
                    <div className="h-8 bg-zinc-200 rounded-full" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                    : 'space-y-4'
                }
              >
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#E8E2D5] p-12 text-center space-y-4">
                <LotusIcon className="w-10 h-8 mx-auto text-[#D4AF37]" />
                <h3 className="font-serif text-lg font-bold text-zinc-900">
                  No Ensembles Found
                </h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto font-light">
                  We could not find any products matching your selected filters. Try clearing your filters or exploring our other collections.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2 rounded-full bg-[#4A0E17] text-white text-xs font-semibold tracking-wider"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-10">
                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setPage(pNum);
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('page', pNum.toString());
                        router.push(`/shop?${params.toString()}`);
                      }}
                      className={`w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                        page === pNum
                          ? 'bg-[#4A0E17] text-white shadow-xs'
                          : 'bg-white border border-[#E8E2D5] text-zinc-700 hover:border-[#4A0E17]'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
                <h3 className="font-serif font-bold text-sm text-zinc-900">
                  Filter Collections
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Categories
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      handleCategorySelect('');
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                      !selectedCategory ? 'bg-[#4A0E17] text-white font-bold' : 'text-zinc-700'
                    }`}
                  >
                    All Sarees & Attire
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => {
                        handleCategorySelect(c.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                        selectedCategory === c.slug
                          ? 'bg-[#4A0E17] text-white font-bold'
                          : 'text-zinc-700'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Presets */}
              <div className="space-y-2 pt-4 border-t border-[#E8E2D5]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  Price
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => {
                      handlePricePreset('', '799');
                      setIsMobileFilterOpen(false);
                    }}
                    className="p-2 rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-center"
                  >
                    Under ₹799
                  </button>
                  <button
                    onClick={() => {
                      handlePricePreset('800', '1499');
                      setIsMobileFilterOpen(false);
                    }}
                    className="p-2 rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-center"
                  >
                    ₹800 – ₹1,499
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#E8E2D5] flex gap-3">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-full border border-zinc-300 text-zinc-700"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-full bg-[#4A0E17] text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <div className="text-center space-y-3">
            <LotusIcon className="w-10 h-8 mx-auto text-[#D4AF37] animate-pulse" />
            <p className="text-xs font-serif text-zinc-600">Loading Collections...</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
