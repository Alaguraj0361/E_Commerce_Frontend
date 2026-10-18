'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';

export const BottomNav = () => {
  const pathname = usePathname();
  const { setIsCartOpen, getTotalItemsCount } = useCartStore();
  const { products: wishlistProducts } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const totalCartCount = getTotalItemsCount();
  const wishlistCount = wishlistProducts.length;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E2D5] py-1.5 px-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium transition-colors ${
            pathname === '/' ? 'text-[#4A0E17] font-semibold' : 'text-zinc-500 hover:text-[#4A0E17]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        {/* Categories */}
        <Link
          href="/shop"
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium transition-colors ${
            pathname === '/shop' ? 'text-[#4A0E17] font-semibold' : 'text-zinc-500 hover:text-[#4A0E17]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Shop</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium transition-colors ${
            pathname === '/wishlist' ? 'text-[#4A0E17] font-semibold' : 'text-zinc-500 hover:text-[#4A0E17]'
          }`}
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-2 bg-[#4A0E17] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
              {wishlistCount}
            </span>
          )}
          <span>Wishlist</span>
        </Link>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium text-zinc-500 hover:text-[#4A0E17] transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute top-0 right-2 bg-[#4A0E17] text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
              {totalCartCount}
            </span>
          )}
          <span>Cart</span>
        </button>

        {/* Account */}
        <Link
          href={isAuthenticated ? '/account' : '/login'}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium transition-colors ${
            pathname.startsWith('/account') || pathname.startsWith('/login')
              ? 'text-[#4A0E17] font-semibold'
              : 'text-zinc-500 hover:text-[#4A0E17]'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{isAuthenticated ? 'Profile' : 'Login'}</span>
        </Link>
      </div>
    </nav>
  );
};
