'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  Minus,
  Plus,
  Loader2,
  Ruler,
  Scissors,
  Sparkles,
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
import { NalmaraEmblem, LotusIcon } from '../../../components/ui/BrandLogo';
import {
  findShowcaseProductBySlug,
  ALL_SHOWCASE_FALLBACK_PRODUCTS,
} from '../../../data/showcaseProductsData';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
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

          try {
            const relatedRes = await api.get(`/products/${prod._id}/related`);
            if (relatedRes.data?.success) {
              setRelatedProducts(relatedRes.data.data || []);
            }
          } catch {
            // non-fatal
          }
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Product not found in remote API:', error);
      }

      // Fallback to curated Nalmara showcase product if not yet in remote database
      const fallbackProd = findShowcaseProductBySlug(slug);
      if (fallbackProd) {
        setProduct(fallbackProd);
        setRelatedProducts(
          ALL_SHOWCASE_FALLBACK_PRODUCTS.filter((p) => p._id !== fallbackProd._id).slice(0, 4)
        );
      }
      setIsLoading(false);
    };

    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  // Extract all unique color options
  const colorOptions = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return [];
    const colorMap = new Map<string, { name: string; colorHex?: string; image?: string; stock: number }>();

    product.variants.forEach((v) => {
      const color = v.attributes?.color?.trim();
      if (color) {
        const key = color.toLowerCase();
        if (!colorMap.has(key)) {
          colorMap.set(key, {
            name: color,
            colorHex: v.attributes?.colorHex || '#888',
            image: v.images?.[0],
            stock: v.stock || 0,
          });
        } else {
          const existing = colorMap.get(key)!;
          existing.stock += v.stock || 0;
          if (!existing.image && v.images?.[0]) existing.image = v.images[0];
        }
      }
    });

    return Array.from(colorMap.values());
  }, [product]);

  // Extract available sizes for currently selected color
  const sizeOptions = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) {
      if (product?.attributes) {
        const attrSizes = product.attributes['Size'] || product.attributes['size'] || [];
        if (Array.isArray(attrSizes) && attrSizes.length > 0) {
          return attrSizes.map((s) => ({ size: String(s).trim(), stock: product.stock || 10 }));
        }
      }
      return [];
    }

    const relevantVariants = selectedColor
      ? product.variants.filter(
          (v) => (v.attributes?.color?.trim() || '').toLowerCase() === selectedColor.toLowerCase()
        )
      : product.variants;

    const sizeMap = new Map<string, { size: string; stock: number; price?: number }>();

    relevantVariants.forEach((v) => {
      const rawSize = v.attributes?.size;
      if (rawSize) {
        const sizes = rawSize.split(/[,/|]+/).map((s: string) => s.trim()).filter(Boolean);
        sizes.forEach((s: string) => {
          const key = s.toUpperCase();
          if (!sizeMap.has(key)) {
            sizeMap.set(key, {
              size: s,
              stock: v.stock || 0,
              price: v.price,
            });
          } else {
            const cur = sizeMap.get(key)!;
            cur.stock += v.stock || 0;
          }
        });
      }
    });

    if (sizeMap.size === 0) {
      product.variants.forEach((v) => {
        const rawSize = v.attributes?.size;
        if (rawSize) {
          const sizes = rawSize.split(/[,/|]+/).map((s: string) => s.trim()).filter(Boolean);
          sizes.forEach((s: string) => {
            const key = s.toUpperCase();
            if (!sizeMap.has(key)) {
              sizeMap.set(key, { size: s, stock: v.stock || 0 });
            }
          });
        }
      });
    }

    return Array.from(sizeMap.values());
  }, [product, selectedColor]);

  // Set initial selectedColor and selectedSize when product loads
  useEffect(() => {
    if (!product) return;

    if (colorOptions.length > 0) {
      const defaultColor = colorOptions[0].name;
      setSelectedColor(defaultColor);

      const matchingVariants =
        product.variants?.filter(
          (v) => (v.attributes?.color?.trim() || '').toLowerCase() === defaultColor.toLowerCase()
        ) || [];

      let foundSize = '';
      for (const v of matchingVariants) {
        if (v.attributes?.size) {
          foundSize = v.attributes.size.split(/[,/|]+/)[0]?.trim() || '';
          if (foundSize) break;
        }
      }
      setSelectedSize(foundSize);
    } else if (sizeOptions.length > 0) {
      setSelectedSize(sizeOptions[0].size);
    }
  }, [product, colorOptions.length]);

  // Match selectedVariant based on selectedColor and selectedSize
  useEffect(() => {
    if (!product?.variants || product.variants.length === 0) {
      setSelectedVariant(null);
      return;
    }

    let match: ProductVariant | undefined;

    if (selectedColor && selectedSize) {
      match = product.variants.find((v) => {
        const vColor = (v.attributes?.color?.trim() || '').toLowerCase();
        const vSizeRaw = v.attributes?.size || '';
        const vSizes = vSizeRaw.split(/[,/|]+/).map((s: string) => s.trim().toLowerCase());
        return (
          vColor === selectedColor.toLowerCase() &&
          (vSizes.includes(selectedSize.toLowerCase()) || vSizeRaw.toLowerCase() === selectedSize.toLowerCase())
        );
      });
    }

    if (!match && selectedColor) {
      match = product.variants.find(
        (v) => (v.attributes?.color?.trim() || '').toLowerCase() === selectedColor.toLowerCase()
      );
    }

    if (!match && selectedSize) {
      match = product.variants.find((v) => {
        const vSizeRaw = v.attributes?.size || '';
        const vSizes = vSizeRaw.split(/[,/|]+/).map((s: string) => s.trim().toLowerCase());
        return vSizes.includes(selectedSize.toLowerCase());
      });
    }

    if (!match) {
      match = product.variants[0];
    }

    setSelectedVariant(match);

    if (selectedColor && product.images && product.images.length > 0) {
      const colorQuery = selectedColor.toLowerCase();

      if (match?.images && match.images.length > 0) {
        const imgIdx = product.images.findIndex((img) => img.url === match?.images?.[0]);
        if (imgIdx !== -1) {
          setActiveImageIndex(imgIdx);
          return;
        }
      }

      const altMatchIdx = product.images.findIndex(
        (img) =>
          img.alt?.toLowerCase().includes(colorQuery) ||
          img.url?.toLowerCase().includes(colorQuery)
      );
      if (altMatchIdx !== -1) {
        setActiveImageIndex(altMatchIdx);
        return;
      }

      const colorIdx = colorOptions.findIndex((c) => c.name.toLowerCase() === colorQuery);
      if (colorIdx >= 0 && colorIdx < product.images.length) {
        setActiveImageIndex(colorIdx);
      }
    }
  }, [selectedColor, selectedSize, product, colorOptions]);

  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);

    const newColorVariants =
      product?.variants?.filter(
        (v) => (v.attributes?.color?.trim() || '').toLowerCase() === colorName.toLowerCase()
      ) || [];

    const availableInNewColor: string[] = [];
    newColorVariants.forEach((v) => {
      if (v.attributes?.size) {
        v.attributes.size
          .split(/[,/|]+/)
          .map((s: string) => s.trim())
          .filter(Boolean)
          .forEach((s: string) => availableInNewColor.push(s));
      }
    });

    if (availableInNewColor.length > 0) {
      const sizeStillAvailable = availableInNewColor.some(
        (s: string) => s.toLowerCase() === selectedSize.toLowerCase()
      );
      if (!sizeStillAvailable) {
        setSelectedSize(availableInNewColor[0]);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-[#FDF6EC] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
        <p className="text-xs font-serif text-[#280619]">Unveiling Couture Masterpiece...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#FDF6EC] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-3xl border-2 border-[#D4AF37]/80 p-10 text-center space-y-4 shadow-xl">
          <NalmaraEmblem className="w-12 h-12 mx-auto" />
          <h2 className="text-2xl font-serif font-bold text-[#280619]">
            Ensemble Not Found
          </h2>
          <p className="text-[#5C3D1E] text-xs sm:text-sm">
            The requested couture outfit does not exist or has been archived from our live catalog.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] shadow-md"
          >
            Return to Collections
          </Link>
        </div>
      </div>
    );
  }

  // Calculate dynamic add-on charges
  const addOnsTotal = product.hasBespokeTailoring
    ? (addOnFeedingZip ? 250 : 0) +
      (addOnCanCan ? 650 : 0) +
      (addOnBlousePad ? 200 : 0)
    : 0;

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
      : 'NALMARA FASHION ATELIER';

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
      '/images/bestsellers/traditional_silk_saree.jpg';

    const selectedAddOnsList: string[] = [];
    if (addOnFeedingZip) selectedAddOnsList.push('Feeding Zip (+₹250)');
    if (addOnCanCan) selectedAddOnsList.push('Can Can Flare (+₹650)');
    if (addOnBlousePad) selectedAddOnsList.push('Blouse Pad (+₹200)');

    const customAttributes: Record<string, any> = {};

    if (selectedColor) {
      customAttributes.color = selectedColor;
    }

    if (selectedSize) {
      customAttributes.size = selectedSize;
    }

    if (product.hasBespokeTailoring) {
      customAttributes.height = selectedHeight;
      customAttributes.neckDesign = selectedNeckDesign;
      customAttributes.sleeves = selectedSleeves;
      if (selectedAddOnsList.length > 0) {
        customAttributes.addOns = selectedAddOnsList;
      }
      if (customNotes.trim()) {
        customAttributes.notes = customNotes.trim();
      }
    }

    addItem({
      productId: product._id,
      variantId: selectedVariant?._id,
      name: product.name,
      slug: product.slug,
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
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* 1. Imperial Royal Plum & 24K Gold Top Breadcrumb Ribbon */}
      <div className="bg-gradient-to-r from-[#280619] via-[#3D0829] to-[#280619] border-b border-[#D4AF37]/70 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-[#FAF0DD]/85 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-[#FFE59E] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
            <Link href="/shop" className="hover:text-[#FFE59E] transition-colors">
              Shop
            </Link>
            {categorySlug && (
              <>
                <ChevronRight className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
                <Link
                  href={`/shop?category=${categorySlug}`}
                  className="hover:text-[#FFE59E] transition-colors capitalize"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-[#D4AF37] flex-shrink-0" />
            <span className="text-[#FFE59E] font-semibold truncate">{product.name}</span>
          </nav>

          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FFE59E]">
            <NalmaraEmblem className="w-4 h-4" />
            <span>100% Authentic Loom Seal</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 space-y-14">
        {/* 2. Main Product Info Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: Gallery (6 cols) */}
          <div className="lg:col-span-6">
            <ProductGallery
              images={product.images}
              productName={product.name}
              activeImageIndex={activeImageIndex}
            />
          </div>

          {/* Right: Royal Couture Details Card (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Brand & Title Plaque */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#D4AF37] text-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.2em]">
                  <LotusIcon className="w-3.5 h-3 text-[#FFE59E]" />
                  <span>{brandName}</span>
                </div>
                <span className="text-xs text-[#7A5B3E] font-mono font-semibold">
                  SKU: {currentSku}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#280619] tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Ratings & Reviews Count */}
              {product.rating > 0 && (
                <div className="flex items-center gap-3 text-xs pt-1">
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#D4AF37] text-[#FFE59E] font-extrabold">
                    <span>{Number(product.rating).toFixed(1)}</span>
                    <Star className="w-3 h-3 fill-[#FFE59E] text-[#FFE59E]" />
                  </div>
                  {product.reviewCount > 0 && (
                    <>
                      <span className="text-[#D4AF37]">✦</span>
                      <span className="text-[#5C3D1E] font-semibold underline">
                        {product.reviewCount} Verified Patron Review{product.reviewCount > 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Pricing Display Plaque (Royal Silk Cream & 24K Gold Frame) */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-r from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] border-2 border-[#D4AF37]/80 shadow-[0_12px_30px_rgba(56,7,37,0.08)] flex flex-wrap items-baseline gap-3">
              <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#B88228] pointer-events-none" />
              <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#B88228] pointer-events-none" />
              <span className="text-3xl sm:text-4xl font-serif font-extrabold text-[#280619]">
                {formatCurrency(currentPrice)}
              </span>
              {comparePrice && comparePrice > currentPrice && (
                <>
                  <span className="text-base text-[#8C7A65] line-through font-medium">
                    {formatCurrency(comparePrice)}
                  </span>
                  <span className="bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] border border-[#D4AF37] text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
              <span className="text-[11px] text-[#5C3D1E] w-full sm:w-auto sm:ml-auto font-semibold">
                GST Included • Free Delivery on Orders Above ₹1,499
              </span>
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-xs sm:text-sm text-[#3F251A] leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            {/* 3. COLOR SELECTION SWATCHES */}
            {colorOptions.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-[#D4AF37]/35">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold uppercase tracking-[0.15em] text-[#280619]">
                      Select Shade:
                    </span>
                    <span className="text-[#8C5818] font-bold capitalize">
                      {selectedColor || 'Select a color'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5C3D1E] font-semibold">
                    {colorOptions.length} Shade{colorOptions.length > 1 ? 's' : ''} Available
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {colorOptions.map((opt) => {
                    const isSelected =
                      selectedColor.toLowerCase() === opt.name.toLowerCase();
                    const isOutOfStock = opt.stock <= 0;

                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => handleSelectColor(opt.name)}
                        className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#D4AF37] bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] shadow-md ring-2 ring-[#D4AF37]/40 scale-[1.02]'
                            : 'border-[#D4AF37]/50 bg-[#FFFDF9] text-[#23120B] hover:border-[#D4AF37]'
                        } ${isOutOfStock ? 'opacity-60' : ''}`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0 shadow-inner"
                          style={{ backgroundColor: opt.colorHex || '#888' }}
                        />
                        <span className="capitalize">{opt.name}</span>
                        {isOutOfStock && (
                          <span className="text-[10px] text-rose-500 font-normal">
                            (Sold Out)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. SIZE SELECTION SWATCHES */}
            {sizeOptions.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-[#D4AF37]/35">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold uppercase tracking-[0.15em] text-[#280619]">
                      Size:
                    </span>
                    <span className="text-[#8C5818] font-bold uppercase">
                      {selectedSize || 'Select a size'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(true)}
                    className="flex items-center gap-1.5 text-[#5B0E3D] hover:text-[#280619] font-bold underline transition-colors cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" /> View Size Chart
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((opt) => {
                    const isSelected =
                      selectedSize.toLowerCase() === opt.size.toLowerCase();
                    const isOutOfStock = opt.stock <= 0;

                    return (
                      <button
                        key={opt.size}
                        type="button"
                        onClick={() => setSelectedSize(opt.size)}
                        className={`min-w-[46px] px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#D4AF37] bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E] shadow-md scale-105'
                            : 'border-[#D4AF37]/50 text-[#23120B] hover:border-[#380725] bg-[#FFFDF9]'
                        } ${isOutOfStock ? 'opacity-50 line-through' : ''}`}
                      >
                        {opt.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. TAILORING CUSTOMIZATION SUITE */}
            {Boolean(product.hasBespokeTailoring) && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DD] border-2 border-[#D4AF37]/70 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#280619]">
                  <Scissors className="w-4 h-4 text-[#8C5818]" />
                  <span>Bespoke Atelier Tailoring</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#5C3D1E] font-bold mb-1">
                      Height (Head to Toe):
                    </label>
                    <select
                      value={selectedHeight}
                      onChange={(e) => setSelectedHeight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D4AF37]/60 bg-[#FFFDF9] text-[#280619] font-semibold focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    >
                      {["4'10\"", "4'11\"", "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"+"].map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#5C3D1E] font-bold mb-1">
                      Neck Design:
                    </label>
                    <select
                      value={selectedNeckDesign}
                      onChange={(e) => setSelectedNeckDesign(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D4AF37]/60 bg-[#FFFDF9] text-[#280619] font-semibold focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                    >
                      <option value="Standard (As shown)">Standard (As shown)</option>
                      <option value="Sweet Heart">Sweet Heart</option>
                      <option value="Round Square">Round Square</option>
                      <option value="U-Round">U-Round</option>
                      <option value="Boat Neck">Boat Neck</option>
                      <option value="Square Neck">Square Neck</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#5C3D1E] font-bold mb-1">
                      Sleeves Style:
                    </label>
                    <select
                      value={selectedSleeves}
                      onChange={(e) => setSelectedSleeves(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D4AF37]/60 bg-[#FFFDF9] text-[#280619] font-semibold focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
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

                {/* Custom Tailoring Add-ons */}
                <div className="pt-2 border-t border-[#D4AF37]/30 space-y-2">
                  <span className="block text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8C5818]">
                    Optional Tailoring Add-ons:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF9] cursor-pointer hover:border-[#380725] transition-colors font-semibold text-[#23120B]">
                      <input
                        type="checkbox"
                        checked={addOnCanCan}
                        onChange={(e) => setAddOnCanCan(e.target.checked)}
                        className="rounded text-[#380725] focus:ring-[#D4AF37] w-4 h-4 accent-[#380725]"
                      />
                      <span>Can Can (+₹650)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF9] cursor-pointer hover:border-[#380725] transition-colors font-semibold text-[#23120B]">
                      <input
                        type="checkbox"
                        checked={addOnFeedingZip}
                        onChange={(e) => setAddOnFeedingZip(e.target.checked)}
                        className="rounded text-[#380725] focus:ring-[#D4AF37] w-4 h-4 accent-[#380725]"
                      />
                      <span>Feeding Zip (+₹250)</span>
                    </label>

                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-[#D4AF37]/50 bg-[#FFFDF9] cursor-pointer hover:border-[#380725] transition-colors font-semibold text-[#23120B]">
                      <input
                        type="checkbox"
                        checked={addOnBlousePad}
                        onChange={(e) => setAddOnBlousePad(e.target.checked)}
                        className="rounded text-[#380725] focus:ring-[#D4AF37] w-4 h-4 accent-[#380725]"
                      />
                      <span>Blouse Pad (+₹200)</span>
                    </label>
                  </div>
                </div>

                {/* Custom Notes */}
                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-[#5C3D1E] mb-1">
                    Custom Measurements or Specific Requests (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bust 35, Waist 29, please add extra margin..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-[#D4AF37]/60 bg-[#FFFDF9] text-[#280619] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 6. PINCODE DELIVERY ESTIMATOR */}
            <div className="p-4 rounded-2xl border border-[#D4AF37]/65 bg-gradient-to-r from-[#FFFDF9] to-[#FAF0DD] space-y-2 shadow-2xs">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#280619] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#8C5818]" /> Check Estimated Delivery Date:
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code..."
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-[#D4AF37]/60 bg-[#FFFDF9] text-[#280619] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] font-mono font-bold"
                />
                <button
                  type="submit"
                  disabled={isCheckingPincode}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#380725] via-[#5B0E3D] to-[#380725] border border-[#D4AF37] text-[#FFE59E] text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isCheckingPincode ? 'Checking...' : 'Verify'}
                </button>
              </form>
              {pincodeStatus && (
                <p
                  className={`text-[11px] leading-relaxed pt-1 ${
                    pincodeStatus.startsWith('✓') ? 'text-emerald-800 font-bold' : 'text-rose-600'
                  }`}
                >
                  {pincodeStatus}
                </p>
              )}
            </div>

            {/* 7. QUANTITY & ROYAL CTA BUTTONS */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border-2 border-[#D4AF37]/75 rounded-full bg-[#FFFDF9] p-1 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-full hover:bg-[#FAF0DD] text-[#280619] disabled:opacity-30 cursor-pointer"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-extrabold text-[#280619]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full hover:bg-[#FAF0DD] text-[#280619] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Cart CTA (Imperial Royal Plum & 24K Gold) */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5B0D3C] via-[#380725] to-[#5B0D3C] border-2 border-[#D4AF37] text-[#FFE59E] font-extrabold py-3.5 px-4 sm:px-6 rounded-full text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] transition-all shadow-[0_10px_24px_rgba(56,7,37,0.3)] hover:from-[#73124C] hover:to-[#380725] active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#FFE59E] shrink-0" /> ADD TO BAG
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-full border-2 transition-colors shadow-xs cursor-pointer shrink-0 ${
                    isLiked
                      ? 'border-[#D4AF37] bg-[#380725] text-[#FFE59E]'
                      : 'border-[#D4AF37]/70 text-[#280619] hover:border-[#D4AF37] bg-[#FFFDF9]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#FFE59E] text-[#FFE59E]' : ''}`} />
                </button>
              </div>

              {/* Direct Buy Now CTA (3D Liquid 24K Gold Foil) */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] hover:opacity-95 text-[#280619] border border-[#FFFDF9] font-extrabold py-4 px-4 sm:px-6 rounded-full text-xs uppercase tracking-[0.16em] sm:tracking-[0.22em] transition-all shadow-[0_12px_30px_rgba(212,175,55,0.45)] active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#280619] fill-current shrink-0" /> BUY IT NOW — FAST DELIVERY
              </button>
            </div>

            {/* 8. TRUST HIGHLIGHTS STRIP */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-2 text-center text-[10px] text-[#23120B] font-bold">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DD] border border-[#D4AF37]/60 shadow-2xs">
                <Truck className="w-4 h-4 mx-auto mb-1 text-[#8C5818]" />
                <span>1–3 Days Dispatch</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DD] border border-[#D4AF37]/60 shadow-2xs">
                <RotateCcw className="w-4 h-4 mx-auto mb-1 text-[#8C5818]" />
                <span>Easy Size Exchange</span>
              </div>
              <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-b from-[#FFFDF9] to-[#FAF0DD] border border-[#D4AF37]/60 shadow-2xs">
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#8C5818]" />
                <span>100% Checked</span>
              </div>
            </div>
          </div>
        </div>

        {/* 9. ROYAL INFORMATION TABS CARD */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] border-2 border-[#D4AF37]/75 p-5 sm:p-8 shadow-[0_14px_34px_rgba(56,7,37,0.08)]">
          <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/25 pointer-events-none" />
          <div className="relative z-10 flex overflow-x-auto scrollbar-none border-b border-[#D4AF37]/40 gap-5 sm:gap-6 text-xs font-extrabold uppercase tracking-[0.16em] sm:tracking-[0.18em] whitespace-nowrap">
            {[
              { id: 'desc', label: 'Description & Craft' },
              { id: 'fabric', label: 'Fabric & Wash Care' },
              { id: 'size', label: 'Fit & Alterations' },
              { id: 'shipping', label: 'Shipping & Returns' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`pb-3.5 relative transition-colors cursor-pointer ${
                  activeTab === t.id
                    ? 'text-[#280619]'
                    : 'text-[#7A5B3E] hover:text-[#280619]'
                }`}
              >
                {t.label}
                {activeTab === t.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#380725] via-[#D4AF37] to-[#380725] rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="relative z-10 pt-6 text-xs sm:text-sm text-[#3F251A] leading-relaxed max-w-4xl space-y-4">
            {activeTab === 'desc' && (
              <div className="space-y-3">
                <p>{product.description}</p>
                <p className="font-bold text-[#280619] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8C5818]" />
                  <span>
                    Handcrafted in India with artisanal care. Minor variations in weave or zari are hallmarks of authentic handlooms.
                  </span>
                </p>
              </div>
            )}

            {activeTab === 'fabric' && (
              <div className="space-y-2">
                <p>
                  <strong className="text-[#280619]">Fabric Composition:</strong> Premium Pure Handloom Silk / Georgette with soft breathable cotton inner lining.
                </p>
                <p>
                  <strong className="text-[#280619]">Care Instructions:</strong> Dry clean strictly recommended for initial 2 washes to preserve zari sheen and embroidery integrity. Steam iron on reverse at low heat.
                </p>
              </div>
            )}

            {activeTab === 'size' && (
              <div className="space-y-2">
                <p>
                  <strong className="text-[#280619]">Inner Margin:</strong> All our readymade pieces are constructed with a 2-inch inner seam margin on both sides for effortless home alterations.
                </p>
                <p>
                  <strong className="text-[#280619]">Custom Sizing:</strong> If your measurements fall between sizes or you have specific torso/skirt length needs, mention details in the tailoring notes box.
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p>
                  <strong className="text-[#280619]">India Shipping:</strong> Free express shipping on all orders over ₹1,499. Orders dispatch within 24–48 hours and arrive in 3–5 business days via insured couriers.
                </p>
                <p>
                  <strong className="text-[#280619]">Direct Concierge:</strong> WhatsApp us at{' '}
                  <strong className="text-[#5B0E3D]">6383163609 | 7871207631</strong> for bespoke bridal or international shipping queries.
                </p>
                <p>
                  <strong className="text-[#280619]">Returns & Exchange:</strong> 7-day hassle-free size exchange policy.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 10. CUSTOMER REVIEWS */}
        <div className="border-t border-[#D4AF37]/35 pt-4">
          <ProductReviewSection productId={product._id} />
        </div>

        {/* 11. RELATED PRODUCTS ("You May Also Love") */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-[#D4AF37]/35 pt-12 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#8C5818]">
                  ✦ Complete Your Royal Wardrobe
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#280619]">
                  You May Also{' '}
                  <span className="font-script italic font-normal text-3xl sm:text-4xl text-[#5B0E3D]">
                    Love
                  </span>
                </h3>
              </div>
              <Link
                href="/shop"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#D4AF37] text-[#FFE59E] text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition-opacity"
              >
                View All →
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
    </div>
  );
}
