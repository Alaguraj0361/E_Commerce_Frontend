'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatCurrency, getDiscountPercentage, resolveMediaUrl } from '../../lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isLiked = isInWishlist(product._id);
  const discountPercent = getDiscountPercentage(product.compareAtPrice || 0, product.price);

  const rawImage =
    product.images && product.images.length > 0 && product.images[0]?.url
      ? product.images[0].url
      : (product as any).image || '';
  const mainImage = resolveMediaUrl(rawImage, '/images/nalmara/hd/cat_sarees_hd.jpg');

  const brandName =
    typeof product.brand === 'object' && product.brand !== null
      ? product.brand.name
      : '';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product._id,
      name: product.name,
      image: mainImage,
      price: product.price,
      sku: product.sku || `SKU-${product._id}`,
      quantity: 1,
      variantId: product.variants?.[0]?._id,
    });

    toast.success(`${product.name} added to cart!`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  if (viewMode === 'list') {
    return (
      <div className="group relative rounded-2xl p-[2px] bg-gradient-to-b from-[#FFE59E] via-[#C8963E] to-[#8C5818] shadow-[0_12px_28px_rgba(56,7,37,0.1)] hover:shadow-[0_20px_42px_rgba(56,7,37,0.2)] transition-all duration-300">
        <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] rounded-[14px] overflow-hidden flex flex-col sm:flex-row h-full">
          <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] sm:w-56 shrink-0 overflow-hidden bg-[#EED9BA] block">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 250px"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-1.5 border border-[#FFE59E]/50 rounded-xl pointer-events-none z-10" />
            {discountPercent > 0 && (
              <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#FFE59E]/85 text-[#FFE59E] text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-[0.14em] z-20">
                {discountPercent}% OFF
              </span>
            )}
          </Link>

          <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C5818]">
                    {brandName || 'NALMARA Verified Loom'}
                  </span>
                </div>
                <button
                  onClick={handleLike}
                  className="p-1.5 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/60 hover:bg-[#380725] hover:text-[#FFE59E] text-[#23120B] transition-colors cursor-pointer"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>
              </div>

              <Link href={`/product/${product.slug}`}>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#23120B] hover:text-[#5B0E3D] transition-colors mt-1">
                  {product.name}
                </h3>
              </Link>

              <p className="text-xs text-[#5A3D28] line-clamp-2 mt-1 font-normal">
                {product.shortDescription || product.description}
              </p>

              <div className="flex items-center gap-2 mt-2.5">
                {product.rating > 0 && (
                  <div className="flex items-center gap-1 bg-[#FFFDF9] border border-[#D4AF37]/60 px-2 py-0.5 rounded-full text-[11px] font-bold text-[#280619]">
                    <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>{Number(product.rating).toFixed(1)}</span>
                    {product.reviewCount > 0 && (
                      <span className="text-[#7A5B3E] font-normal">({product.reviewCount})</span>
                    )}
                  </div>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ✓ 100% Quality Checked
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/35">
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-extrabold text-lg text-[#280619]">
                  {formatCurrency(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xs text-[#7A5B3E] line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <button
                onClick={handleQuickAdd}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5B0D3C] via-[#3F0729] to-[#5B0D3C] hover:from-[#73124C] hover:to-[#4E0B34] border border-[#D4AF37] text-[#FFE59E] text-[10px] font-serif font-bold uppercase tracking-[0.16em] flex items-center gap-1.5 transition-all shadow-[0_6px_16px_rgba(56,7,37,0.28)] cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#FFE59E]" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative rounded-xl sm:rounded-2xl p-[2px] bg-gradient-to-b from-[#FFE59E] via-[#C8963E] to-[#8C5818] shadow-[0_12px_28px_rgba(56,7,37,0.1)] hover:shadow-[0_20px_42px_rgba(56,7,37,0.22)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
      <div className="flex flex-col flex-1 bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] rounded-[10px] sm:rounded-[14px] overflow-hidden">
        {/* Product Image Container */}
        <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full bg-[#EED9BA] overflow-hidden block">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-1.5 border border-[#FFE59E]/50 rounded-lg sm:rounded-xl pointer-events-none z-10" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
            {discountPercent > 0 && (
              <span className="bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#FFE59E]/85 text-[#FFE59E] text-[8.5px] sm:text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-[0.14em]">
                {discountPercent}% OFF
              </span>
            )}
            {product.newArrival && (
              <span className="bg-gradient-to-r from-[#FFF5C0] via-[#E5C158] to-[#C69C3A] text-[#280619] border border-[#FFFDF9] text-[8.5px] sm:text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-[0.14em]">
                NEW ARRIVAL
              </span>
            )}
            {product.bestSeller && !product.newArrival && (
              <span className="bg-gradient-to-r from-[#FFF5C0] via-[#E5C158] to-[#C69C3A] text-[#280619] border border-[#FFFDF9] text-[8.5px] sm:text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-[0.14em]">
                BESTSELLER
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleLike}
            className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFDF9]/95 hover:bg-[#380725] hover:text-[#FFE59E] border border-[#D4AF37] text-[#23120B] flex items-center justify-center transition-all shadow-md z-20 cursor-pointer"
            aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          {/* Bottom-Left Rating Pill Overlaid on Image (Only when live rating exists) */}
          {product.rating > 0 && (
            <div className="absolute bottom-2.5 left-2.5 z-20 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFDF9]/95 border border-[#D4AF37]/80 text-[10px] font-bold text-[#280619] shadow-sm">
              <span>{Number(product.rating).toFixed(1)}</span>
              <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
              {product.reviewCount > 0 && (
                <>
                  <span className="text-[#D4AF37]">|</span>
                  <span className="text-[#5C3D1E] font-medium text-[9.5px]">{product.reviewCount}</span>
                </>
              )}
            </div>
          )}
        </Link>

        {/* Details */}
        <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between space-y-1.5 sm:space-y-2">
          <div>
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <p className="text-[9.5px] uppercase tracking-[0.12em] text-[#8C5818] font-bold truncate">
                {brandName || 'NALMARA Couture'}
              </p>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#D4AF37]/80 text-[8px] font-bold text-[#FFE59E] uppercase tracking-wider">
                ✦ Royal
              </span>
            </div>

            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif font-bold text-xs sm:text-[15px] text-[#23120B] group-hover:text-[#5B0E3D] transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Price Row & Royal Plum Add to Cart Pill */}
          <div className="pt-1 border-t border-[#D4AF37]/30 space-y-1.5 sm:space-y-2">
            <div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                {discountPercent > 0 && (
                  <span className="text-[10.5px] sm:text-xs font-bold text-emerald-700">
                    ↓{discountPercent}%
                  </span>
                )}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-[10px] sm:text-xs text-[#7A5B3E] line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
                <span className="font-serif font-extrabold text-xs sm:text-base text-[#280619]">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <p className="text-[9.5px] text-emerald-800 font-medium mt-0.5">
                Free Insured Delivery
              </p>
            </div>

            <button
              onClick={handleQuickAdd}
              className="w-full py-1.5 sm:py-2 px-3 rounded-full bg-gradient-to-r from-[#5B0D3C] via-[#3F0729] to-[#5B0D3C] hover:from-[#73124C] hover:to-[#4E0B34] border border-[#D4AF37] text-[#FFE59E] text-[9.5px] sm:text-[10.5px] font-serif font-bold uppercase tracking-[0.14em] flex items-center justify-center gap-1.5 shadow-[0_6px_16px_rgba(56,7,37,0.25)] transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3 text-[#FFE59E]" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
