'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { SearchModal } from '../search/SearchModal';

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { setIsCartOpen, getTotalItemsCount, fetchCart, mergeGuestCart } = useCartStore();
  const { products: wishlistProducts, fetchWishlist } = useWishlistStore();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
    fetchCart();
    fetchWishlist();
  }, [checkAuth, fetchCart, fetchWishlist]);

  // When user logs in, merge guest cart
  useEffect(() => {
    if (isAuthenticated) {
      mergeGuestCart();
    }
  }, [isAuthenticated, mergeGuestCart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = getTotalItemsCount();
  const wishlistCount = wishlistProducts.length;

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: "Men's", href: '/shop?category=mens-fashion' },
    { label: "Women's", href: '/shop?category=womens-fashion' },
    { label: 'Electronics', href: '/shop?category=electronics' },
    { label: 'New Arrivals', href: '/shop?newArrival=true' },
    { label: 'Offers', href: '/shop?hasDiscount=true' },
  ];

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="bg-zinc-900 text-zinc-300 text-xs font-medium py-2 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <span>Free express delivery across India on orders over ₹1,499</span>
        <span className="hidden sm:inline text-zinc-500">•</span>
        <span className="hidden sm:inline">Use code <strong className="text-white font-semibold">WELCOME10</strong> for 10% off</span>
      </div>

      {/* 2. Main Sticky Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-sm border-b border-zinc-200/80 dark:border-zinc-800/80 py-3.5'
            : 'bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white font-sans group-hover:opacity-90 transition-opacity">
              EFFIDOO<span className="text-emerald-600">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-white ${
                    isActive
                      ? 'text-zinc-900 dark:text-white font-semibold border-b-2 border-zinc-900 dark:border-white pb-0.5'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Search store"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-fade-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] font-bold flex items-center justify-center animate-fade-in">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative">
              {isAuthenticated && user ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 pl-2 py-1 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-xs font-bold">
                    {user.firstName[0]}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label="Login"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && isAuthenticated && user && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 py-2 z-20 animate-slide-up">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs text-zinc-400">Signed in as</p>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <UserIcon className="w-4 h-4" /> My Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    >
                      <Package className="w-4 h-4" /> My Orders
                    </Link>

                    {user.role === 'admin' && (
                      <a
                        href="http://localhost:3001"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
                      >
                        <span className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4" /> Admin Console
                        </span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-mono">
                          :3001
                        </span>
                      </a>
                    )}

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 3. Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* 4. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col animate-slide-up">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xl font-black uppercase text-zinc-900 dark:text-white">
                EFFIDOO<span className="text-emerald-600">.</span>
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-zinc-500 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-base font-medium text-zinc-800 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white py-1"
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-3">
                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                >
                  <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <UserIcon className="w-4 h-4" /> Account
                    </Link>
                    {user?.role === 'admin' && (
                      <a
                        href="http://localhost:3001"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between text-sm text-amber-600 font-medium"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" /> Admin Console
                        </span>
                        <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-mono">
                          :3001
                        </span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-2 text-sm text-rose-600 pt-2"
                    >
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </>
                ) : (
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center bg-zinc-900 text-white py-2.5 rounded-xl text-sm font-semibold"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center border border-zinc-200 text-zinc-800 py-2.5 rounded-xl text-sm font-medium"
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
