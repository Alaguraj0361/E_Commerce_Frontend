'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Check,
  Plus,
  Minus,
  Loader2,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { Product, ProductVariant } from '../../../types';
import { ProductGallery } from '../../../components/product/ProductGallery';
import { ProductReviewSection } from '../../../components/product/ProductReviewSection';
import { ProductCard } from '../../../components/product/ProductCard';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';
import { formatCurrency, getDiscountPercentage } from '../../../lib/utils';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  const { addItem, setIsCartOpen } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/slug/${slug}`);
        if (res.data?.success && res.data.data) {
          const prod: Product = res.data.data;
          setProduct(prod);

          if (prod.variants && prod.variants.length > 0) {
            setSelectedVariant(prod.variants[0]);
          }

          // Fetch related products
          const relatedRes = await api.get(`/products/${prod._id}/related`);
          if (relatedRes.data?.success) {
            setRelatedProducts(relatedRes.data.data || []);
          }
        }
      } catch (error) {
        console.error('Failed to load product details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-900 dark:text-zinc-100 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Product Not Found</h2>
        <p className="text-zinc-500 text-sm">The artifact you requested does not exist or has been archived.</p>
        <Link
          href="/shop"
          className="inline-block bg-zinc-900 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Dynamic values based on selected variant
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const discountPercent = getDiscountPercentage(product.compareAtPrice || 0, currentPrice);
  const isLiked = isInWishlist(product._id);

  const brandName =
    typeof product.brand === 'object' && product.brand !== null
      ? product.brand.name
      : '';

  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? product.category.name
      : 'Catalog';

  const categorySlug =
    typeof product.category === 'object' && product.category !== null
      ? product.category.slug
      : '';

  const handleAddToCart = () => {
    if (currentStock < quantity) {
      toast.error('Selected quantity exceeds available stock');
      return;
    }

    const imageToUse =
      selectedVariant?.images?.[0] ||
      product.images[0]?.url ||
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=400&q=80';

    addItem({
      productId: product._id,
      variantId: selectedVariant?._id,
      name: product.name,
      image: imageToUse,
      price: currentPrice,
      sku: currentSku,
      quantity,
      attributes: selectedVariant?.attributes,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link href="/shop" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
          Shop
        </Link>
        {categorySlug && (
          <>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link
              href={`/shop?category=${categorySlug}`}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              {categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate">
          {product.name}
        </span>
      </nav>

      {/* 2. Main Product Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Gallery */}
        <div>
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Details & Purchase Options */}
        <div className="space-y-6">
          {/* Brand & Title */}
          <div>
            {brandName && (
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1.5">
                {brandName}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating Stars & SKU */}
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {product.rating > 0 ? product.rating.toFixed(1) : '5.0'}
                </span>
                <span className="text-zinc-400 underline cursor-pointer">
                  ({product.reviewCount || 12} customer reviews)
                </span>
              </div>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-400 font-mono">SKU: {currentSku}</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              {formatCurrency(currentPrice)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > currentPrice && (
              <>
                <span className="text-base text-zinc-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
                <span className="bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Variants Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Select Variant
                </span>
                <span className="text-zinc-400">
                  {selectedVariant ? selectedVariant.sku : 'None'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?._id === v._id;
                  const label = Object.entries(v.attributes || {})
                    .filter(([key]) => key !== 'colorHex')
                    .map(([_, val]) => val)
                    .join(' / ');

                  return (
                    <button
                      key={v.sku}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
                      }`}
                    >
                      {v.attributes?.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: v.attributes.colorHex }}
                        />
                      )}
                      <span>{label || v.sku}</span>
                      {v.price !== product.price && (
                        <span className="text-[10px] opacity-75">
                          (+{formatCurrency(v.price - product.price)})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            {currentStock > 5 ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                In Stock ({currentStock} units ready to dispatch)
              </span>
            ) : currentStock > 0 ? (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Only {currentStock} remaining in stock - order soon
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400">
                Out of Stock (Awaiting replenishment)
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl p-1 bg-white dark:bg-zinc-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock}
                  className="p-2 text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border transition-colors ${
                  isLiked
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-600'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-zinc-400'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Buy Now CTA */}
            <button
              onClick={handleBuyNow}
              disabled={currentStock <= 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Zap className="w-4 h-4" /> Buy It Now
            </button>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
              <Truck className="w-4 h-4 mx-auto mb-1 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 block">Free Shipping</span>
              <span className="text-[10px] text-zinc-400">On orders $100+</span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 block">30-Day Returns</span>
              <span className="text-[10px] text-zinc-400">Hassle-free guarantee</span>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-zinc-700 dark:text-zinc-300" />
              <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 block">Authenticity</span>
              <span className="text-[10px] text-zinc-400">100% Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tabbed Specifications & Description */}
      <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-8">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-4 text-sm font-bold tracking-wide transition-colors ${
              activeTab === 'desc'
                ? 'border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-bold tracking-wide transition-colors ${
              activeTab === 'specs'
                ? 'border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-4 text-sm font-bold tracking-wide transition-colors ${
              activeTab === 'shipping'
                ? 'border-b-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Shipping & Returns
          </button>
        </div>

        <div className="py-8 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl">
          {activeTab === 'desc' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              <div className="py-3 grid grid-cols-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">SKU</span>
                <span className="font-mono text-zinc-500">{currentSku}</span>
              </div>
              <div className="py-3 grid grid-cols-2">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Category</span>
                <span className="text-zinc-500">{categoryName}</span>
              </div>
              {brandName && (
                <div className="py-3 grid grid-cols-2">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">Brand</span>
                  <span className="text-zinc-500">{brandName}</span>
                </div>
              )}
              {product.attributes &&
                Object.entries(product.attributes).map(([attrKey, attrVals]) => (
                  <div key={attrKey} className="py-3 grid grid-cols-2 capitalize">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{attrKey}</span>
                    <span className="text-zinc-500">{attrVals.join(', ')}</span>
                  </div>
                ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Worldwide Express Dispatch</h4>
              <p>
                All orders are dispatched from our climate-controlled facilities within 24 hours of payment confirmation. Complimentary express shipping is automatically applied on all orders exceeding $100.
              </p>
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100 pt-2">30-Day Compliant Returns</h4>
              <p>
                If you are not thoroughly captivated by your purchase, return it within 30 days in original condition with tags attached for a full reimbursement.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Customer Reviews Section */}
      <ProductReviewSection productId={product._id} />

      {/* 5. Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              You May Also Admire
            </h2>
            <Link
              href={`/shop?category=${categorySlug}`}
              className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
            >
              View More in {categoryName}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
