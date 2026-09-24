'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { formatCurrency, getDiscountPercentage } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isLiked = isInWishlist(product._id);
  const discountPercent = getDiscountPercentage(product.compareAtPrice || 0, product.price);
  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80';

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
      sku: product.sku,
      quantity: 1,
      variantId: product.variants?.[0]?._id,
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-zinc-100 dark:border-zinc-800">
      {/* Product Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[3/4] w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden block">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.newArrival && (
            <span className="bg-zinc-900 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {product.bestSeller && !product.newArrival && (
            <span className="bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isLiked
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-200 hover:bg-white hover:text-rose-500 shadow-sm'
          }`}
          aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-zinc-900/90 hover:bg-zinc-900 text-white backdrop-blur-md py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
          </button>
        </div>
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {brandName && (
            <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1">
              {brandName}
            </p>
          )}

          <Link href={`/product/${product.slug}`}>
            <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              {product.rating > 0 ? product.rating.toFixed(1) : '5.0'}
            </span>
            <span className="text-[11px] text-zinc-400">
              ({product.reviewCount || 12})
            </span>
          </div>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {formatCurrency(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-zinc-400 line-through">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
