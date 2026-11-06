'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency, resolveMediaUrl } from '../../lib/utils';
import { NalmaraEmblem } from '../../components/ui/BrandLogo';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { products, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleMoveToCart = (product: any) => {
    const rawImg = product.images?.[0]?.url || product.image || '';
    const img = resolveMediaUrl(rawImg, '/images/nalmara/hd/cat_sarees_hd.jpg');
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: img,
      price: product.price,
      sku: product.sku || `SKU-${product._id}`,
      quantity: 1,
    });
    removeFromWishlist(product._id);
    toast.success(`Moved "${product.name}" to your Shopping Bag`);
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-[#23120B]">
      {/* 1. ROYAL PALACE HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#280619] via-[#3D0829] to-[#280619] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b-2 border-[#D4AF37]">
        <div className="max-w-[1440px] mx-auto relative rounded-3xl border border-[#D4AF37]/45 bg-[#220415]/65 p-6 sm:p-10 text-center space-y-3">
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#FFE59E] pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#FFE59E] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#380725] to-[#5B0E3D] border border-[#FFE59E]/85 text-[#FFE59E] text-[10px] font-bold tracking-[0.25em] uppercase">
            <NalmaraEmblem className="w-4 h-4" />
            <span>Nalmara Fashion • Thoothukudi</span>
            <Sparkles className="w-3 h-3 text-[#FFE59E]" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#FFFDF9] leading-tight">
            Your Saved{' '}
            <span className="font-script italic font-normal text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] bg-clip-text text-transparent">
              Wishlist
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-[#FAF0DD]/85 font-light max-w-xl mx-auto leading-relaxed">
            Your saved sarees, salwar suits, kurtis, and kids wear ready to order anytime.
          </p>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-[#D4AF37]">
            <Link href="/" className="hover:text-[#FFE59E] text-[#FAF0DD]/75">Home</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <Link href="/shop" className="hover:text-[#FFE59E] text-[#FAF0DD]/75">Shop</Link>
            <span className="text-[#D4AF37]/50">/</span>
            <span className="text-[#FFFDF9] font-semibold">Wishlist ({products.length})</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN WISHLIST GRID */}
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-12">
        {products.length === 0 ? (
          <div className="relative max-w-md mx-auto py-14 text-center space-y-5 bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#F3E0C0] rounded-3xl p-8 border-2 border-[#D4AF37]/80 shadow-[0_20px_50px_rgba(56,7,37,0.1)]">
            <div className="absolute inset-[5px] rounded-[20px] border border-[#D4AF37]/30 pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#380725] to-[#280619] border-2 border-[#D4AF37] flex items-center justify-center mx-auto text-[#FFE59E] shadow-md">
              <Heart className="w-7 h-7 text-[#FFE59E]" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#280619]">
              Your Wishlist is{' '}
              <span className="font-script italic font-normal text-3xl text-[#5B0E3D]">
                Empty
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5C3D1E] font-normal max-w-xs mx-auto leading-relaxed">
              Explore our collections and tap the heart icon on any ensemble to save it to your personal curation.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FFF6D6] via-[#FFE59E] to-[#D4AF37] text-[#280619] border border-[#FFFDF9] px-7 py-3 rounded-full text-xs font-extrabold uppercase tracking-[0.2em] transition-all shadow-md"
              >
                Explore Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => {
              const rawImg = product.images?.[0]?.url || (product as any).image || '';
              const img = resolveMediaUrl(rawImg, '/images/nalmara/hd/cat_sarees_hd.jpg');

              return (
                <div
                  key={product._id}
                  className="group relative rounded-2xl p-[2px] bg-gradient-to-b from-[#FFE59E] via-[#C8963E] to-[#8C5818] shadow-[0_12px_30px_rgba(56,7,37,0.1)] hover:shadow-[0_20px_45px_rgba(56,7,37,0.22)] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FAF0DD] to-[#EFE0C2] rounded-[14px] p-2 flex flex-col flex-1 justify-between">
                    {/* Image */}
                    <Link
                      href={`/product/${product.slug}`}
                      className="relative aspect-[3/4] w-full bg-[#280619] rounded-xl overflow-hidden block border border-[#D4AF37]/50"
                    >
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        unoptimized
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(product._id);
                        }}
                        className="absolute top-2.5 right-2.5 p-2 rounded-full bg-[#280619]/90 border border-[#D4AF37] text-[#FFE59E] hover:text-rose-400 transition-colors shadow-sm cursor-pointer"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Link>

                    {/* Info & Move to Cart */}
                    <div className="p-3 flex flex-col flex-1 justify-between space-y-3">
                      <div>
                        <Link href={`/product/${product.slug}`}>
                          <h3 className="font-serif font-bold text-xs sm:text-sm text-[#280619] hover:text-[#5B0E3D] transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="font-serif text-base font-extrabold text-[#280619] mt-1">
                          {formatCurrency(product.price)}
                        </p>
                      </div>

                      <button
                        onClick={() => handleMoveToCart(product)}
                        className="w-full bg-gradient-to-r from-[#5B0D3C] via-[#3F0729] to-[#5B0D3C] hover:from-[#73124C] hover:to-[#4E0B34] text-[#FFE59E] border border-[#D4AF37] py-2.5 rounded-full text-[11px] font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#FFE59E]" /> Move to Bag
                      </button>
                    </div>
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
