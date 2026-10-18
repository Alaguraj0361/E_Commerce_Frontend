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
      <div className="group bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row">
        <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] sm:w-56 shrink-0 overflow-hidden bg-zinc-100 block">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 250px"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            unoptimized={typeof mainImage === 'string' && mainImage.startsWith('data:')}
          />
          {discountPercent > 0 && (
            <span className="absolute top-2 left-2 bg-[#4A0E17] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </Link>

        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D2D]">
                {brandName || 'NALMARA Handloom'}
              </span>
              <button
                onClick={handleLike}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : 'text-zinc-600'}`} />
              </button>
            </div>

            <Link href={`/product/${product.slug}`}>
              <h3 className="font-serif text-base sm:text-lg font-medium text-zinc-900 hover:text-[#4A0E17] transition-colors mt-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-zinc-500 line-clamp-2 mt-1 font-light">
              {product.shortDescription || product.description}
            </p>

            <div className="flex items-center gap-1.5 mt-2 text-[#D4AF37] text-xs">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(product.rating || 5) ? 'fill-[#D4AF37]' : 'text-zinc-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-zinc-400 text-[11px]">({product.reviewCount || 12})</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D5]">
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-lg text-zinc-900">
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
              className="px-5 py-2 rounded-full bg-[#4A0E17] hover:bg-[#5E141F] text-white text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8E2D5] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full bg-[#FAF7F2] overflow-hidden block">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          unoptimized={typeof mainImage === 'string' && mainImage.startsWith('data:')}
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <span className="bg-[#4A0E17] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wide">
              {discountPercent}% OFF
            </span>
          )}
          {product.newArrival && (
            <span className="bg-[#FAF7F2] text-[#4A0E17] border border-[#4A0E17]/20 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              NEW
            </span>
          )}
          {product.bestSeller && !product.newArrival && (
            <span className="bg-[#D4AF37] text-zinc-950 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleLike}
          className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-zinc-700 flex items-center justify-center transition-all shadow-sm z-10"
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : 'text-zinc-600'}`} />
        </button>

        {/* Desktop Quick Add Hover Overlay */}
        <div className="hidden sm:block absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-[#4A0E17]/95 hover:bg-[#4A0E17] text-white backdrop-blur-xs py-2 rounded-full text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 shadow-lg transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
          </button>
        </div>
      </Link>

      {/* Details */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between space-y-2">
        <div>
          {brandName && (
            <p className="text-[10px] uppercase tracking-widest text-[#8C6D2D] font-semibold mb-0.5 truncate">
              {brandName}
            </p>
          )}

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-serif font-medium text-xs sm:text-sm text-zinc-900 group-hover:text-[#4A0E17] transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-[#D4AF37] text-[10px]">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                    i < Math.round(product.rating || 5) ? 'fill-[#D4AF37]' : 'text-zinc-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-zinc-400 font-light">
              ({product.reviewCount || 15})
            </span>
          </div>
        </div>

        {/* Price Row & Mobile Add to Cart */}
        <div className="pt-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif font-bold text-xs sm:text-sm text-zinc-900">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-[10px] sm:text-xs text-zinc-400 line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile-only Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden w-full mt-2 py-1.5 px-3 rounded-full bg-[#4A0E17] text-white text-[11px] font-semibold tracking-wide flex items-center justify-center gap-1 shadow-xs"
          >
            <ShoppingBag className="w-3 h-3" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
