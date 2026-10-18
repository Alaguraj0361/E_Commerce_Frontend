'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../lib/utils';
import { LotusIcon } from '../../components/ui/BrandLogo';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { products, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleMoveToCart = (product: any) => {
    const img = product.images?.[0]?.url || product.image || '/images/bestsellers/traditional_silk_saree.jpg';
    addItem({
      productId: product._id,
      name: product.name,
      image: img,
      price: product.price,
      sku: product.sku || `SKU-${product._id}`,
      quantity: 1,
    });
    removeFromWishlist(product._id);
    toast.success(`Moved "${product.name}" to bag`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-zinc-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-[#4A0E17] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.15),transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold tracking-widest uppercase">
            <LotusIcon className="w-4 h-3.5" />
            <span>Private Curation</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Your Saved Wishlist
          </h1>

          <p className="text-xs sm:text-sm text-zinc-200 font-light max-w-xl mx-auto leading-relaxed">
            Your personal treasury of coveted silks, bridal couture, and artisanal ensembles.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:underline text-zinc-200">Home</Link>
            <span className="text-white/50">/</span>
            <Link href="/shop" className="hover:underline text-zinc-200">Shop</Link>
            <span className="text-white/50">/</span>
            <span className="text-white font-medium">Wishlist ({products.length})</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN WISHLIST GRID */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        {products.length === 0 ? (
          <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white rounded-3xl p-8 border border-[#E8E2D5] shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E8E2D5] flex items-center justify-center mx-auto text-[#4A0E17]">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-zinc-900">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs text-zinc-500 font-light max-w-xs mx-auto leading-relaxed">
              Explore our collections and tap the heart icon on any ensemble to save it to your personal curation.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-[#4A0E17] hover:bg-[#5E141F] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
              >
                Explore Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => {
              const img = product.images?.[0]?.url || product.image || '/images/bestsellers/traditional_silk_saree.jpg';

              return (
                <div
                  key={product._id}
                  className="group relative bg-white rounded-3xl border border-[#E8E2D5] hover:border-[#D4AF37] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative aspect-[3/4] w-full bg-zinc-100 overflow-hidden block"
                  >
                    <Image
                      src={img}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(product._id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-zinc-500 hover:text-rose-600 transition-colors shadow-sm cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Link>

                  {/* Info & Move to Cart */}
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-serif font-bold text-sm text-zinc-900 hover:text-[#4A0E17] transition-colors line-clamp-1">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="font-serif text-base font-bold text-[#4A0E17] mt-1">
                        {formatCurrency(product.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="w-full bg-[#4A0E17] hover:bg-[#5E141F] text-white border border-[#7A1D2A] py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" /> Move to Bag
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
