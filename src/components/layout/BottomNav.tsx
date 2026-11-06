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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0B09] border-t-2 border-[#D4AF37]/75 py-1.5 px-2 shadow-[0_-8px_24px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <Link
          href="/"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium transition-all ${
            pathname === '/' ? 'text-[#FFE59E] font-bold' : 'text-[#EADBC0]/70 hover:text-[#FFE59E]'
          }`}
        >
          {pathname === '/' && (
            <span className="absolute -top-1.5 inset-x-2 h-[2.5px] rounded-full bg-gradient-to-r from-[#FFE59E] to-[#D4AF37]" />
          )}
          <Home className={`w-5 h-5 ${pathname === '/' ? 'text-[#D4AF37]' : ''}`} />
          <span>Home</span>
        </Link>

        {/* Categories */}
        <Link
          href="/shop"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium transition-all ${
            pathname === '/shop' ? 'text-[#FFE59E] font-bold' : 'text-[#EADBC0]/70 hover:text-[#FFE59E]'
          }`}
        >
          {pathname === '/shop' && (
            <span className="absolute -top-1.5 inset-x-2 h-[2.5px] rounded-full bg-gradient-to-r from-[#FFE59E] to-[#D4AF37]" />
          )}
          <Grid className={`w-5 h-5 ${pathname === '/shop' ? 'text-[#D4AF37]' : ''}`} />
          <span>Categories</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium transition-all ${
            pathname === '/wishlist' ? 'text-[#FFE59E] font-bold' : 'text-[#EADBC0]/70 hover:text-[#FFE59E]'
          }`}
        >
          {pathname === '/wishlist' && (
            <span className="absolute -top-1.5 inset-x-2 h-[2.5px] rounded-full bg-gradient-to-r from-[#FFE59E] to-[#D4AF37]" />
          )}
          <Heart className={`w-5 h-5 ${pathname === '/wishlist' ? 'text-[#D4AF37]' : ''}`} />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-2 bg-[#D4AF37] text-[#0E0B09] text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
              {wishlistCount}
            </span>
          )}
          <span>Wishlist</span>
        </Link>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium text-[#EADBC0]/70 hover:text-[#FFE59E] transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          {totalCartCount > 0 && (
            <span className="absolute top-0 right-2 bg-[#D4AF37] text-[#0E0B09] text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
              {totalCartCount}
            </span>
          )}
          <span>Cart</span>
        </button>

        {/* Account */}
        <Link
          href={isAuthenticated ? '/account' : '/login'}
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-medium transition-all ${
            pathname.startsWith('/account') || pathname.startsWith('/login')
              ? 'text-[#FFE59E] font-bold'
              : 'text-[#EADBC0]/70 hover:text-[#FFE59E]'
          }`}
        >
          {(pathname.startsWith('/account') || pathname.startsWith('/login')) && (
            <span className="absolute -top-1.5 inset-x-2 h-[2.5px] rounded-full bg-gradient-to-r from-[#FFE59E] to-[#D4AF37]" />
          )}
          <User className={`w-5 h-5 ${pathname.startsWith('/account') || pathname.startsWith('/login') ? 'text-[#D4AF37]' : ''}`} />
          <span>{isAuthenticated ? 'Account' : 'Login'}</span>
        </Link>
      </div>
    </nav>
  );
};
