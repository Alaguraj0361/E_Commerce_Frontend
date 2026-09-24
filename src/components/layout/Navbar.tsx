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
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { SearchModal } from '../search/SearchModal';
import { formatCurrency } from '../../lib/utils';

export const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { setIsCartOpen, getTotalItemsCount, getSubtotal, fetchCart, mergeGuestCart } =
    useCartStore();
  const { products: wishlistProducts, fetchWishlist } = useWishlistStore();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
    fetchCart();
    fetchWishlist();
  }, [checkAuth, fetchCart, fetchWishlist]);

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
  const cartSubtotal = getSubtotal();
  const wishlistCount = wishlistProducts.length;

  const categories = [
    { label: 'All Collections', href: '/shop' },
    { label: 'Lehenga & Half Saree', href: '/shop?category=lehenga-half-saree' },
    { label: 'Sarees', href: '/shop?category=saree' },
    { label: 'Maxi Cotton', href: '/shop?category=maxi-cotton' },
    { label: 'Classy Casuals', href: '/shop?category=classy-casuals' },
    { label: 'Festive Edit', href: '/shop?category=festive-edit' },
    { label: 'Comfy Cotton', href: '/shop?category=comfy-cotton' },
    { label: 'Best Sellers', href: '/shop?bestSeller=true' },
    { label: 'New Arrivals', href: '/shop?newArrival=true' },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT & CONTACT MARQUEE (Matching Sculpted.in) */}
      <div className="bg-zinc-950 text-zinc-300 text-[11px] border-b border-zinc-900 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Contact Details Left */}
          <div className="hidden lg:flex items-center gap-4 text-zinc-400 font-medium">
            <a
              href="tel:+919361923406"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-500" />
              <span>+91 93619 23406</span>
            </a>
            <span className="text-zinc-700">•</span>
            <a
              href="mailto:support@effidoo.com"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Mail className="w-3 h-3 text-amber-500" />
              <span>support@effidoo.com</span>
            </a>
          </div>

          {/* Marquee Center Message */}
          <div className="flex items-center justify-center gap-2 text-center overflow-hidden font-medium">
            <span className="inline-block animate-pulse text-amber-400">✨</span>
            <span>
              For Express & International Shipping WhatsApp Us{' '}
              <a
                href="https://wa.me/919361923406"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 underline font-semibold hover:text-amber-300"
              >
                +91-9361923406
              </a>
              {' '}| We Ship Worldwide | Free Express Delivery in India over ₹1,499
            </span>
          </div>

          {/* Right Announcement */}
          <div className="hidden lg:flex items-center gap-2 text-zinc-400">
            <span>Use code <strong className="text-amber-400 font-bold">WELCOME10</strong> for 10% off</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN STICKY HEADER */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-md border-b border-zinc-200/80 dark:border-zinc-800/80 py-3'
            : 'bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-900 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-zinc-700 dark:text-zinc-200 hover:text-zinc-900"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Left Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            <Link
              href="/"
              className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors ${
                pathname === '/' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''
              }`}
            >
              Home
            </Link>

            {/* Shop with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <Link
                href="/shop"
                className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-2"
              >
                <span>Shop</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </Link>

              {isShopDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 py-3 animate-fade-in z-50">
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    Collections & Categories
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={() => setIsShopDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/shop?bestSeller=true"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              Best Sellers
            </Link>
            <Link
              href="/shop?newArrival=true"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              New Arrivals
            </Link>
          </nav>

          {/* Center Brand Logo (Sculpted by Effidoo) */}
          <Link href="/" className="flex flex-col items-center group text-center">
            <span className="text-xl sm:text-2xl font-serif tracking-widest uppercase text-zinc-950 dark:text-white font-extrabold group-hover:text-amber-600 transition-colors">
              EFFIDOO
            </span>
            <span className="text-[9px] tracking-[0.25em] font-medium uppercase text-zinc-500 dark:text-zinc-400 -mt-0.5">
              Sculpted Couture
            </span>
          </Link>

          {/* Right Header Controls (Search, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Quick Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-xs transition-colors"
              aria-label="Search products"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline text-zinc-400 text-xs">Search Products...</span>
            </button>

            {/* Wishlist Link with Badge */}
            <Link
              href="/wishlist"
              className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              aria-label="View wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Widget Button (Sculpted.in style: shows price + count) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-zinc-900 dark:text-zinc-100 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-all text-xs font-semibold"
              aria-label="View shopping bag"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-bold">
                {cartSubtotal > 0 ? formatCurrency(cartSubtotal) : 'Cart'}
              </span>
            </button>

            {/* Account Icon / Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                    {user?.firstName?.charAt(0) || 'U'}
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
                  aria-label="Sign in"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && isAuthenticated && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <UserIcon className="w-4 h-4" /> My Profile
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <Package className="w-4 h-4" /> My Orders & Tracking
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  >
                    <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
                  </Link>
                  {user?.role === 'admin' && (
                    <a
                      href="http://localhost:3001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-amber-600 font-bold hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin Console
                    </a>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-left border-t border-zinc-100 dark:border-zinc-800 mt-1"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 3. MOBILE SLIDE-OUT NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white dark:bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
                <div>
                  <span className="text-xl font-serif font-black tracking-widest uppercase">
                    EFFIDOO
                  </span>
                  <p className="text-[10px] tracking-widest text-zinc-500 uppercase">
                    Sculpted Couture
                  </p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-bold text-sm text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Home
                </Link>

                <div className="pt-2">
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Categories
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {categories.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:text-amber-600 rounded-lg transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
                  <Link
                    href="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    <span>Shopping Cart</span>
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      {totalCartCount} items
                    </span>
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    <span>My Wishlist</span>
                    <span className="text-xs bg-rose-100 dark:bg-rose-950 text-rose-600 px-2 py-0.5 rounded-full">
                      {wishlistCount}
                    </span>
                  </Link>
                  <Link
                    href={isAuthenticated ? '/account' : '/login'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200"
                  >
                    {isAuthenticated ? 'My Account & Orders' : 'Sign In / Register'}
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Footer Contact */}
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs text-zinc-500">
              <a
                href="https://wa.me/919361923406"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-600 font-bold"
              >
                <span>💬 WhatsApp: +91 93619 23406</span>
              </a>
              <p>Email: support@effidoo.com</p>
              <p className="text-[11px]">Worldwide shipping & custom tailoring</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. SEARCH MODAL */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
