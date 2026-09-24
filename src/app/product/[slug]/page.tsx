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
  Ruler,
  Scissors,
  Sparkles,
  MapPin,
  Clock,
  RotateCw,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { Product, ProductVariant } from '../../../types';
import { ProductGallery } from '../../../components/product/ProductGallery';
import { ProductReviewSection } from '../../../components/product/ProductReviewSection';
import { ProductCard } from '../../../components/product/ProductCard';
import { SizeChartModal } from '../../../components/product/SizeChartModal';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Customization Suite State
  const [selectedHeight, setSelectedHeight] = useState<string>("5'4\"");
  const [selectedNeckDesign, setSelectedNeckDesign] = useState<string>('Standard (As shown)');
  const [selectedSleeves, setSelectedSleeves] = useState<string>('Standard (As shown)');
  const [addOnFeedingZip, setAddOnFeedingZip] = useState(false);
  const [addOnCanCan, setAddOnCanCan] = useState(false);
  const [addOnBlousePad, setAddOnBlousePad] = useState(false);
  const [customNotes, setCustomNotes] = useState('');

  // Pincode Delivery Estimator State
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);

  // Collapsible Information Tabs
  const [activeTab, setActiveTab] = useState<'desc' | 'fabric' | 'size' | 'shipping'>('desc');

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
            // Default to 'M' size if present, else first variant
            const defaultVar =
              prod.variants.find((v) => v.attributes?.size === 'M') || prod.variants[0];
            setSelectedVariant(defaultVar);
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
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
          Product Not Found
        </h2>
        <p className="text-zinc-500 text-sm">
          The requested couture outfit does not exist or has been archived.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-amber-400 text-zinc-950 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-amber-300"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  // Calculate dynamic add-on charges
  const addOnsTotal =
    (addOnFeedingZip ? 250 : 0) +
    (addOnCanCan ? 650 : 0) +
    (addOnBlousePad ? 200 : 0);

  const basePrice = selectedVariant ? selectedVariant.price : product.price;
  const currentPrice = basePrice + addOnsTotal;
  const comparePrice = product.compareAtPrice
    ? product.compareAtPrice + addOnsTotal
    : undefined;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const discountPercent = getDiscountPercentage(comparePrice || 0, currentPrice);
  const isLiked = isInWishlist(product._id);

  const brandName =
    typeof product.brand === 'object' && product.brand !== null
      ? product.brand.name
      : 'Effidoo Atelier';

  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? product.category.name
      : 'Couture';

  const categorySlug =
    typeof product.category === 'object' && product.category !== null
      ? product.category.slug
      : '';

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeStatus('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setIsCheckingPincode(true);
    setTimeout(() => {
      setIsCheckingPincode(false);
      setPincodeStatus(
        `✓ Delivery available for ${pincode}! Estimated delivery within 3–5 business days. Cash on delivery & Express delivery eligible.`
      );
    }, 400);
  };

  const handleAddToCart = () => {
    if (currentStock < quantity) {
      toast.error('Selected quantity exceeds available stock');
      return;
    }

    const imageToUse =
      selectedVariant?.images?.[0] ||
      product.images[0]?.url ||
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80';

    const selectedAddOnsList: string[] = [];
    if (addOnFeedingZip) selectedAddOnsList.push('Feeding Zip (+₹250)');
    if (addOnCanCan) selectedAddOnsList.push('Can Can Flare (+₹650)');
    if (addOnBlousePad) selectedAddOnsList.push('Blouse Pad (+₹200)');

    const customAttributes: Record<string, any> = {
      size: selectedVariant?.attributes?.size || 'Free Size',
      height: selectedHeight,
      neckDesign: selectedNeckDesign,
      sleeves: selectedSleeves,
    };

    if (selectedAddOnsList.length > 0) {
      customAttributes.addOns = selectedAddOnsList;
    }
    if (customNotes.trim()) {
      customAttributes.notes = customNotes.trim();
    }

    addItem({
      productId: product._id,
      variantId: selectedVariant?._id,
      name: product.name,
      image: imageToUse,
      price: currentPrice,
      sku: currentSku,
      quantity,
      attributes: customAttributes,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-amber-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link href="/shop" className="hover:text-amber-600 transition-colors">
          Shop
        </Link>
        {categorySlug && (
          <>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link
              href={`/shop?category=${categorySlug}`}
              className="hover:text-amber-600 transition-colors"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Details, Customization Suite & Purchase Controls (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-400 font-bold">
                {brandName}
              </span>
              <span className="text-xs text-zinc-400 font-mono">SKU: {currentSku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Reviews Count */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-zinc-900 dark:text-zinc-100 ml-0.5">
                  {product.rating > 0 ? product.rating.toFixed(1) : '4.9'}
                </span>
              </div>
              <span className="text-zinc-300">•</span>
              <span className="text-zinc-500 underline cursor-pointer">
                ({product.reviewCount || 36} verified client reviews)
              </span>
            </div>
          </div>

          {/* Pricing Display (Dynamic with strike-through & discount) */}
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-baseline gap-3">
            <span className="text-3xl font-serif font-extrabold text-zinc-950 dark:text-white">
              {formatCurrency(currentPrice)}
            </span>
            {comparePrice && comparePrice > currentPrice && (
              <>
                <span className="text-base text-zinc-400 line-through">
                  {formatCurrency(comparePrice)}
                </span>
                <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                  {discountPercent}% OFF
                </span>
              </>
            )}
            <span className="text-[11px] text-zinc-500 ml-auto font-medium">
              Tax included • Free Shipping across India
            </span>
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* 3. SIZE SELECTION SWATCHES */}
          <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  Size:
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {selectedVariant?.attributes?.size || 'Select a size'}
                </span>
              </div>

              {/* View Size Chart Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(true)}
                className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 font-bold underline transition-colors"
              >
                <Ruler className="w-3.5 h-3.5" /> View Size Chart
              </button>
            </div>

            {/* Size Swatch Buttons (XXXS to 5XL and Custom) */}
            <div className="flex flex-wrap gap-2">
              {product.variants && product.variants.length > 0
                ? product.variants.map((v) => {
                    const sizeLabel = v.attributes?.size || v.sku;
                    const isSelected = selectedVariant?._id === v._id;

                    return (
                      <button
                        key={v.sku}
                        onClick={() => setSelectedVariant(v)}
                        className={`min-w-[42px] px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'border-zinc-950 bg-zinc-950 text-white dark:border-amber-400 dark:bg-amber-400 dark:text-zinc-950 shadow-md scale-105'
                            : 'border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-400 bg-white dark:bg-zinc-900'
                        }`}
                      >
                        {sizeLabel}
                      </button>
                    );
                  })
                : ['XS', 'S', 'M', 'L', 'XL', '2XL', 'Custom'].map((s) => (
                    <button
                      key={s}
                      className="px-3 py-2 rounded-xl text-xs font-bold border border-zinc-200 text-zinc-700"
                    >
                      {s}
                    </button>
                  ))}
            </div>
          </div>

          {/* 4. TAILORING CUSTOMIZATION SUITE */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              <Scissors className="w-4 h-4 text-amber-500" />
              <span>Bespoke Tailoring Options</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Height Selector */}
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  Height (Head to Toe):
                </label>
                <select
                  value={selectedHeight}
                  onChange={(e) => setSelectedHeight(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  {["4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"+"].map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* Neck Design Selector */}
              <div>
                <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  Neck Design:
                </label>
                <select
                  value={selectedNeckDesign}
                  onChange={(e) => setSelectedNeckDesign(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Standard (As shown)">Standard (As shown)</option>
                  <option value="Sweet Heart">Sweet Heart</option>
                  <option value="Round Square">Round Square</option>
                  <option value="U-Round">U-Round</option>
                  <option value="Boat Neck">Boat Neck</option>
                  <option value="Square Neck">Square Neck</option>
                </select>
              </div>

              {/* Sleeves Preference */}
              <div className="sm:col-span-2">
                <label className="block text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  Sleeves Style:
                </label>
                <select
                  value={selectedSleeves}
                  onChange={(e) => setSelectedSleeves(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-medium focus:ring-1 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Standard (As shown)">Standard (As shown)</option>
                  <option value="Sleeveless">Sleeveless</option>
                  <option value="Cap Sleeves">Cap Sleeves</option>
                  <option value="Elbow Length">Elbow Length</option>
                  <option value="3/4th Sleeves">3/4th Sleeves</option>
                  <option value="Full Length">Full Length</option>
                </select>
              </div>
            </div>

            {/* Custom Tailoring Add-ons (Checkboxes with dynamic price update) */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Optional Tailoring Add-ons:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer hover:border-amber-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={addOnCanCan}
                    onChange={(e) => setAddOnCanCan(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Can Can Flare (+₹650)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer hover:border-amber-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={addOnFeedingZip}
                    onChange={(e) => setAddOnFeedingZip(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Feeding Zip (+₹250)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 cursor-pointer hover:border-amber-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={addOnBlousePad}
                    onChange={(e) => setAddOnBlousePad(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>Blouse Pad (+₹200)</span>
                </label>
              </div>
            </div>

            {/* Custom Notes / Measurements */}
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                Custom Measurements or Specific Requests (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Bust 35, Waist 29, please add extra margin..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:ring-1 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 5. PINCODE DELIVERY ESTIMATOR */}
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-500" /> Check Estimated Delivery Date:
            </span>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit PIN code..."
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="flex-1 px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
              <button
                type="submit"
                disabled={isCheckingPincode}
                className="px-4 py-2 rounded-xl bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {isCheckingPincode ? 'Checking...' : 'Check'}
              </button>
            </form>
            {pincodeStatus && (
              <p
                className={`text-[11px] leading-relaxed pt-1 ${
                  pincodeStatus.startsWith('✓') ? 'text-emerald-600 font-medium' : 'text-rose-500'
                }`}
              >
                {pincodeStatus}
              </p>
            )}
          </div>

          {/* 6. QUANTITY & CTA BUTTONS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-full bg-white dark:bg-zinc-900 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 disabled:opacity-30"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-zinc-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" /> ADD TO CART
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-full border transition-colors ${
                  isLiked
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950 text-rose-500'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-rose-500 hover:border-rose-300'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Direct Buy Now CTA */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full inline-flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-3.5 px-6 rounded-full text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-current" /> BUY IT NOW
            </button>
          </div>

          {/* 7. TRUST HIGHLIGHTS STRIP */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center text-[10px] text-zinc-500 font-medium">
            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900">
              <Truck className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <span>3–8 Days Dispatch</span>
            </div>
            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900">
              <RotateCcw className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <span>Easy Size Exchange</span>
            </div>
            <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-900">
              <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-amber-500" />
              <span>100% Authentic Fabric</span>
            </div>
          </div>
        </div>
      </div>

      {/* 8. INFORMATION ACCORDIONS / TABS */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'desc'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Description & Craft
            {activeTab === 'desc' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('fabric')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'fabric'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Fabric & Wash Care
            {activeTab === 'fabric' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('size')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'size'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Fit & Alterations
            {activeTab === 'size' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'shipping'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-zinc-400 hover:text-zinc-700'
            }`}
          >
            Shipping & Returns
            {activeTab === 'shipping' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>
        </div>

        <div className="py-6 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl space-y-4">
          {activeTab === 'desc' && (
            <div className="space-y-3">
              <p>{product.description}</p>
              <p className="font-semibold text-zinc-900 dark:text-white">
                ✨ Handcrafted in India with artisanal care. Minor irregularities in weave or dye are hallmarks of authentic handlooms.
              </p>
            </div>
          )}

          {activeTab === 'fabric' && (
            <div className="space-y-2">
              <p>
                <strong>Fabric Composition:</strong> Premium Pure Handloom Georgette / Handwoven Silk with soft breathable cotton inner lining.
              </p>
              <p>
                <strong>Care Instructions:</strong> Dry clean strictly recommended for initial 2 washes to preserve zari sheen and embroidery integrity. Steam iron on reverse at low heat.
              </p>
            </div>
          )}

          {activeTab === 'size' && (
            <div className="space-y-2">
              <p>
                <strong>Inner Margin:</strong> All our readymade pieces are constructed with a 2-inch inner seam margin on both sides for effortless home alterations.
              </p>
              <p>
                <strong>Custom Sizing:</strong> If your measurements fall between sizes or you have specific torso/skirt length needs, select &ldquo;Custom&rdquo; size and mention details in the tailoring notes box.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-2">
              <p>
                <strong>India Shipping:</strong> Free express shipping on all orders over ₹1,499. Orders dispatch within 24–48 hours and arrive in 3–8 business days via Bluedart/Delhivery.
              </p>
              <p>
                <strong>Worldwide Delivery:</strong> We ship to 20+ countries via DHL Express. WhatsApp us at +91-9361923406 for direct international order queries.
              </p>
              <p>
                <strong>Returns & Exchange:</strong> 7-day hassle-free size exchange policy.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 9. CUSTOMER REVIEWS */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <ProductReviewSection productId={product._id} />
      </div>

      {/* 10. RELATED PRODUCTS ("You May Also Love") */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              You May Also Love
            </h3>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-wider text-amber-600 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((rp) => (
              <ProductCard key={rp._id} product={rp} />
            ))}
          </div>
        </div>
      )}

      {/* Size Chart Modal Component */}
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </div>
  );
}
