'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/utils';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { products, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleMoveToCart = (product: any) => {
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      sku: product.sku,
      quantity: 1,
    });
    removeFromWishlist(product._id);
    toast.success(`Moved "${product.name}" to cart`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="pb-8 border-b border-zinc-200 dark:border-zinc-800 mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Saved to Wishlist ({products.length})
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Your personal curation of desired garments, acoustics, and design artifacts.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Your Wishlist is Empty
          </h2>
          <p className="text-xs text-zinc-500">
            Tap the heart icon on any artifact to save it here for later.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              {/* Image */}
              <Link
                href={`/product/${product.slug}`}
                className="relative aspect-[3/4] w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden block"
              >
                <Image
                  src={
                    product.images[0]?.url ||
                    'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(product._id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md text-zinc-500 hover:text-rose-500 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Link>

              {/* Info & Move to Cart */}
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">
                    {formatCurrency(product.price)}
                  </p>
                </div>

                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
