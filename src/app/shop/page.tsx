'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../lib/api';
import { Product, Category, Brand } from '../../types';
import { ProductCard } from '../../components/product/ProductCard';
import { formatCurrency } from '../../lib/utils';

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
    const cat = searchParams.get('category') || '';
    setSelectedCategory(cat);
    const brand = searchParams.get('brand') || '';
    setSelectedBrand(brand);
    const search = searchParams.get('search') || '';
    setSearchQuery(search);
    const minP = searchParams.get('minPrice') || '';
    setMinPrice(minP);
    const maxP = searchParams.get('maxPrice') || '';
    setMaxPrice(maxP);
    const r = searchParams.get('rating') || '';
    setRating(r);
    setInStock(searchParams.get('inStock') === 'true');
    setHasDiscount(searchParams.get('hasDiscount') === 'true');
    const s = searchParams.get('sort') || 'featured';
    setSort(s);
    const pg = parseInt(searchParams.get('page') || '1', 10);
    setPage(pg);
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

  // Load Categories & Brands
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands'),
        ]);
        if (catRes.data?.success) setCategories(catRes.data.data || []);
        if (brandRes.data?.success) setBrands(brandRes.data.data || []);
      } catch (error) {
        // Ignore
      }
    };
    fetchMetadata();
  }, []);

  // Fetch Products based on filters
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
        if (res.data?.success) {
          setProducts(res.data.data || []);
          if (res.data.meta) {
            setTotalPages(res.data.meta.totalPages || 1);
            setTotalProducts(res.data.meta.total || 0);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Catalog & Collections
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
            Shop Everything
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Showing <strong className="text-zinc-900 dark:text-zinc-100">{products.length}</strong> of{' '}
            {totalProducts} handcrafted items
          </p>
        </div>

        {/* Sort & View Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 pr-9 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-zinc-900 cursor-pointer shadow-sm"
            >
              <option value="featured">Featured Collection</option>
              <option value="newest">Newest Releases</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="best-seller">Best Selling</option>
              <option value="top-rated">Highest Customer Rating</option>
            </select>
            <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl p-1 bg-white dark:bg-zinc-900">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-700'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-4 border-b border-zinc-100 dark:border-zinc-800 text-xs">
          <span className="text-zinc-400 font-medium mr-1">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-800 dark:text-zinc-200">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedBrand && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-800 dark:text-zinc-200">
              Brand: {selectedBrand}
              <button onClick={() => setSelectedBrand('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-800 dark:text-zinc-200">
              Price: ₹{minPrice || '0'} - ₹{maxPrice || '∞'}
              <button onClick={() => { setMinPrice(''); setMaxPrice(''); }}><X className="w-3 h-3" /></button>
            </span>
          )}
          {rating && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-800 dark:text-zinc-200">
              Rating: {rating}★ & above
              <button onClick={() => setRating('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {inStock && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-800 dark:text-zinc-200">
              In Stock Only
              <button onClick={() => setInStock(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {hasDiscount && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-800 dark:text-zinc-200">
              On Sale
              <button onClick={() => setHasDiscount(false)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-zinc-800 dark:text-zinc-200">
              &ldquo;{searchQuery}&rdquo;
              <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pt-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <aside className="hidden lg:block space-y-8 pr-6 border-r border-zinc-100 dark:border-zinc-800">
          {/* Categories */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold mb-3">
              Categories
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === ''}
                  onChange={() => handleCategorySelect('')}
                  className="rounded text-zinc-900 focus:ring-zinc-900"
                />
                All Categories
              </label>
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat.slug}
                    onChange={() => handleCategorySelect(cat.slug)}
                    className="rounded text-zinc-900 focus:ring-zinc-900"
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold mb-3">
              Price Range (₹)
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900"
              />
              <span className="text-zinc-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold mb-3">
              Customer Rating
            </h3>
            <div className="space-y-2">
              {[4, 3].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={rating === r.toString()}
                    onChange={() => setRating(r.toString())}
                    className="rounded text-zinc-900"
                  />
                  {r} Stars & Above
                </label>
              ))}
            </div>
          </div>

          {/* Availability & Offers */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold mb-3">
              Preferences
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="rounded text-zinc-900"
                />
                In Stock Items Only
              </label>
              <label className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasDiscount}
                  onChange={(e) => setHasDiscount(e.target.checked)}
                  className="rounded text-zinc-900"
                />
                Promotional Discounts Only
              </label>
            </div>
          </div>
        </aside>

        {/* PRODUCTS LISTING GRID */}
        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-100 dark:border-zinc-800 p-8">
              <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                No matching products found
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">
                Try loosening your filters, broadening your price range, or searching for a different keyword.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-12">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx + 1}
                      onClick={() => setPage(idx + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold ${
                        page === idx + 1
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                          : 'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-semibold disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col animate-slide-up p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Filter Products
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div>
                <h4 className="text-xs uppercase font-bold text-zinc-400 mb-2">Category</h4>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <input
                      type="radio"
                      name="m-cat"
                      checked={selectedCategory === ''}
                      onChange={() => {
                        handleCategorySelect('');
                        setIsMobileFilterOpen(false);
                      }}
                    />
                    All
                  </label>
                  {categories.map((c) => (
                    <label
                      key={c._id}
                      className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <input
                        type="radio"
                        name="m-cat"
                        checked={selectedCategory === c.slug}
                        onChange={() => {
                          handleCategorySelect(c.slug);
                          setIsMobileFilterOpen(false);
                        }}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs uppercase font-bold text-zinc-400 mb-2">Price (₹)</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 p-2 text-xs border rounded-lg bg-zinc-50 dark:bg-zinc-800"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 p-2 text-xs border rounded-lg bg-zinc-50 dark:bg-zinc-800"
                  />
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h4 className="text-xs uppercase font-bold text-zinc-400 mb-2">Options</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                    />
                    In Stock Only
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={hasDiscount}
                      onChange={(e) => setHasDiscount(e.target.checked)}
                    />
                    Discounted Only
                  </label>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl text-sm font-semibold"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full border border-zinc-200 dark:border-zinc-800 py-3 rounded-xl text-sm text-zinc-600 dark:text-zinc-400"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-zinc-400">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
