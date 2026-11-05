'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatCurrency, getDiscountPercentage } from '../../lib/utils';
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

  const mainImage =
    product.images && product.images.length > 0 && product.images[0]?.url
      ? product.images[0].url
      : (product as any).image || '/images/categories/sarees.jpg';

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
      <div className="group bg-gradient-to-b from-[#FFFDF9] to-[#FAF4E8] rounded-2xl border-2 border-[#D4AF37]/55 hover:border-[#B8860B] overflow-hidden shadow-[0_10px_28px_rgba(24,3,6,0.06)] hover:shadow-[0_18px_38px_rgba(24,3,6,0.12)] transition-all duration-300 flex flex-col sm:flex-row">
        <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] sm:w-56 shrink-0 overflow-hidden bg-[#F7F1E5] block">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 250px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            unoptimized={typeof mainImage === 'string' && mainImage.startsWith('data:')}
          />
          <div className="absolute inset-1.5 border border-[#FFE59E]/40 rounded-xl pointer-events-none z-10" />
          {discountPercent > 0 && (
            <span className="absolute top-2.5 left-2.5 bg-[#180306]/95 border border-[#D4AF37]/75 text-[#FFE59E] text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-[0.14em] z-20">
              {discountPercent}% OFF
            </span>
          )}
        </Link>

        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8C6D2D]">
                  {brandName || 'NALMARA Verified Loom'}
                </span>
              </div>
              <button
                onClick={handleLike}
                className="p-1.5 rounded-full bg-white border border-[#D4AF37]/40 hover:bg-[#180306] hover:text-[#FFE59E] text-zinc-600 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>

            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#180306] hover:text-[#6B1220] transition-colors mt-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-[#5A4235] line-clamp-2 mt-1 font-light">
              {product.shortDescription || product.description}
            </p>

            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex items-center gap-1 bg-[#FAF3E3] border border-[#D4AF37]/40 px-2 py-0.5 rounded-full text-[11px] font-bold text-[#7A591B]">
                <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                <span>{product.rating || '4.9'}</span>
                <span className="text-zinc-400 font-normal">({product.reviewCount || 18})</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                ✓ 100% Quality Checked
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/30">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-lg text-[#180306]">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleQuickAdd}
              className="px-5 py-2.5 rounded-full bg-[#180306] hover:bg-[#3A0910] border border-[#D4AF37]/80 text-[#FFE59E] text-[10px] font-bold uppercase tracking-[0.18em] flex items-center gap-1.5 transition-all shadow-md"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-gradient-to-b from-[#FFFDF9] to-[#FAF4E8] rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#D4AF37]/55 hover:border-[#B8860B] shadow-[0_10px_28px_rgba(24,3,6,0.06)] hover:shadow-[0_18px_38px_rgba(24,3,6,0.14)] hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full bg-[#F7F1E5] overflow-hidden block">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          unoptimized={typeof mainImage === 'string' && mainImage.startsWith('data:')}
        />
        <div className="absolute inset-1.5 border border-[#FFE59E]/40 rounded-lg sm:rounded-xl pointer-events-none z-10" />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
          {discountPercent > 0 && (
            <span className="bg-[#180306]/95 border border-[#D4AF37]/75 text-[#FFE59E] text-[8.5px] sm:text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-[0.14em]">
              {discountPercent}% OFF
            </span>
          )}
          {product.newArrival && (
            <span className="bg-gradient-to-r from-[#FFF5C0] via-[#E5C158] to-[#C69C3A] text-[#180306] text-[8.5px] sm:text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-[0.14em]">
              NEW ARRIVAL
            </span>
          )}
          {product.bestSeller && !product.newArrival && (
            <span className="bg-gradient-to-r from-[#FFF5C0] via-[#E5C158] to-[#C69C3A] text-[#180306] text-[8.5px] sm:text-[9.5px] font-bold px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-[0.14em]">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleLike}
          className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 hover:bg-[#180306] hover:text-[#FFE59E] border border-[#D4AF37]/50 text-zinc-700 flex items-center justify-center transition-all shadow-md z-20"
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Bottom Glassmorphic Trust Seal */}
        <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between px-2.5 py-1 rounded-full bg-[#180306]/85 backdrop-blur-md border border-[#D4AF37]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <span className="text-[8.5px] font-bold uppercase tracking-[0.14em] text-[#FFE59E]">✓ 100% Quality Checked</span>
          <span className="text-[8.5px] text-white/80 font-medium">6.3m + Blouse</span>
        </div>
      </Link>

      {/* Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <p className="text-[9.5px] uppercase tracking-[0.14em] text-[#8C6D2D] font-bold truncate">
              {brandName || 'NALMARA Couture'}
            </p>
            <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Ready
            </span>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif font-bold text-xs sm:text-[15px] text-[#180306] group-hover:text-[#6B1220] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price Row & Add to Cart */}
        <div className="pt-1.5 border-t border-[#D4AF37]/25 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-xs sm:text-base text-[#180306]">
                {formatCurrency(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-zinc-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-0.5 text-[#B38728] text-[10px] font-bold bg-[#FAF3E3] px-1.5 py-0.5 rounded-full border border-[#D4AF37]/30">
              <Star className="w-2.5 h-2.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span>{product.rating || '4.9'}</span>
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            className="w-full py-2 px-3 rounded-full bg-[#180306] hover:bg-[#3A0910] border border-[#D4AF37]/80 text-[#FFE59E] text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.18em] flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <ShoppingBag className="w-3 h-3 text-[#D4AF37]" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
