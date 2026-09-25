'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ShieldCheck,
  RotateCcw,
  Tag,
  Gift,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { BrandLogo } from '../ui/BrandLogo';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { setIsCartOpen, getTotalItemsCount, fetchCart, mergeGuestCart } =
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
  const wishlistCount = wishlistProducts.length;

  const categories = [
    { label: 'Sarees', href: '/shop?category=sarees' },
    { label: 'Lehengas', href: '/shop?category=lehengas' },
    { label: 'Salwar Suits', href: '/shop?category=salwar-suits' },
    { label: 'Kurtis', href: '/shop?category=kurtis' },
    { label: 'Anarkali', href: '/shop?category=anarkali' },
    { label: "Men's Wear", href: '/shop?category=mens-wear' },
    { label: "Kid's Wear", href: '/shop?category=kids-wear' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR (Dark Emerald & Gold Accents matching Mockup) */}
      <div className="bg-[#030D08] text-[#FAF8F5] text-[11px] border-b border-[#D4AF37]/25 py-2 px-4 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left item */}
          <div className="flex items-center gap-1.5 text-[#E5C07B] font-medium">
            <Gift className="w-3.5 h-3.5 text-[#E5C07B]" />
            <span>Free Shipping on Orders Above ₹1,499</span>
          </div>

          {/* Center items */}
          <div className="hidden md:flex items-center gap-3 text-zinc-300 font-medium">
            <div className="flex items-center gap-1.5 hover:text-[#E5C07B] transition-colors cursor-pointer">
              <RotateCcw className="w-3.5 h-3.5 text-[#E5C07B]" />
              <span>Easy Returns</span>
            </div>
            <span className="text-zinc-600">|</span>
            <div className="flex items-center gap-1.5 hover:text-[#E5C07B] transition-colors cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E5C07B]" />
              <span>Secure Payments</span>
            </div>
          </div>

          {/* Right item */}
          <div className="flex items-center gap-1.5 font-medium text-right">
            <Tag className="w-3.5 h-3.5 text-[#E5C07B]" />
            <span className="text-zinc-300">
              Get 10% OFF on Your First Order <span className="hidden sm:inline">| Use Code : </span>
              <strong className="text-[#E5C07B] tracking-wide font-bold">WELCOME10</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (Deep Forest Emerald #061811) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-[#061811] border-b border-[#D4AF37]/20 text-white ${
          isScrolled ? 'shadow-2xl py-3 backdrop-blur-md bg-[#061811]/95' : 'py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-1.5 text-zinc-200 hover:text-[#E5C07B] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo with Gold Lotus */}
          <div className="flex-shrink-0">
            <BrandLogo size="md" theme="dark" />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider font-medium text-zinc-200">
            <Link
              href="/"
              className={`hover:text-[#E5C07B] transition-colors py-1 ${
                pathname === '/' ? 'text-[#E5C07B] font-semibold border-b-2 border-[#E5C07B] pb-0.5' : ''
              }`}
            >
              Home
            </Link>

            <Link
              href="/shop"
              className={`hover:text-[#E5C07B] transition-colors py-1 ${
                pathname === '/shop' && !pathname.includes('category')
                  ? 'text-[#E5C07B] font-semibold'
                  : ''
              }`}
            >
              Shop
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button
                className="flex items-center gap-1 hover:text-[#E5C07B] transition-colors py-1 focus:outline-none"
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
              >
                <span>Collections</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#E5C07B]" />
              </button>

              {isCollectionsOpen && (
                <div className="absolute top-full left-0 w-56 bg-[#081D14] border border-[#D4AF37]/30 rounded-xl shadow-2xl py-2 mt-1 z-50 animate-fade-in backdrop-blur-md">
                  <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#E5C07B]/70 border-b border-[#D4AF37]/15">
                    Explore Collections
                  </div>
                  {categories.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={() => setIsCollectionsOpen(false)}
                      className="block px-4 py-2 text-xs text-zinc-200 hover:bg-[#0E3324] hover:text-[#E5C07B] transition-colors"
                    >
                      {cat.label}
                    </Link>
                  ))}
                  <div className="border-t border-[#D4AF37]/15 mt-1 pt-1">
                    <Link
                      href="/shop"
                      onClick={() => setIsCollectionsOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-[#E5C07B] hover:bg-[#0E3324]"
                    >
                      View All Collections →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="hover:text-[#E5C07B] transition-colors py-1"
            >
              About
            </Link>

            <Link
              href="/blog"
              className="hover:text-[#E5C07B] transition-colors py-1"
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className="hover:text-[#E5C07B] transition-colors py-1"
            >
              Contact
            </Link>
          </nav>

          {/* Centered Search Bar Pill */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-xs md:max-w-sm relative hidden sm:block"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for sarees, lehengas, kurtis..."
              className="w-full bg-[#FAF8F5] text-zinc-900 placeholder:text-zinc-500 text-xs px-4 py-2 pr-9 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-zinc-200/50 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-[#061811] transition-colors"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Right Action Icons (User, Wishlist, Cart) */}
          <div className="flex items-center gap-4 sm:gap-5">
            {/* User Account */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1 text-zinc-200 hover:text-[#E5C07B] transition-colors flex items-center"
                  aria-label="User account"
                >
                  <UserIcon className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  className="p-1 text-zinc-200 hover:text-[#E5C07B] transition-colors flex items-center"
                  aria-label="Sign in"
                >
                  <UserIcon className="w-4 h-4" />
                </Link>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#081D14] border border-[#D4AF37]/30 rounded-xl shadow-2xl py-2 z-50 animate-fade-in text-xs">
                  <div className="px-4 py-2 border-b border-[#D4AF37]/15">
                    <p className="font-semibold text-white truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-zinc-200 hover:bg-[#0E3324] hover:text-[#E5C07B]"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-zinc-200 hover:bg-[#0E3324] hover:text-[#E5C07B]"
                  >
                    Order History
                  </Link>
                  {user?.role === 'admin' && (
                    <a
                      href="http://localhost:3001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-[#E5C07B] hover:bg-[#0E3324] font-medium"
                    >
                      Admin Dashboard ↗
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-rose-400 hover:bg-[#0E3324] flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Link with Red Badge */}
            <Link
              href="/wishlist"
              className="relative p-1 text-zinc-200 hover:text-[#E5C07B] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm">
                {wishlistCount > 0 ? wishlistCount : 1}
              </span>
            </Link>

            {/* Cart Button with Red Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 text-zinc-200 hover:text-[#E5C07B] transition-colors"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm">
                {totalCartCount > 0 ? totalCartCount : 1}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="sm:hidden px-4 pt-2 pb-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for sarees, lehengas, kurtis..."
              className="w-full bg-[#FAF8F5] text-zinc-900 placeholder:text-zinc-500 text-xs px-4 py-2 pr-9 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-zinc-200/50 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </header>

      {/* 3. MOBILE SLIDEOUT DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#061811] text-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#D4AF37]/30">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#D4AF37]/20">
                <BrandLogo size="sm" theme="dark" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold tracking-wider text-zinc-200 hover:text-[#E5C07B]"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-semibold tracking-wider text-zinc-200 hover:text-[#E5C07B]"
                >
                  Shop
                </Link>

                <div className="pt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#E5C07B] mb-2">
                    Our Collections
                  </p>
                  <div className="space-y-2 pl-3 border-l border-[#D4AF37]/20">
                    {categories.map((cat) => (
                      <Link
                        key={cat.label}
                        href={cat.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs text-zinc-300 hover:text-[#E5C07B]"
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <Link
                    href="/about"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-semibold tracking-wider text-zinc-200 hover:text-[#E5C07B]"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-semibold tracking-wider text-zinc-200 hover:text-[#E5C07B]"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-semibold tracking-wider text-zinc-200 hover:text-[#E5C07B]"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-[#D4AF37]/20 pt-6 space-y-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-xs text-zinc-300">
                    Signed in as <strong className="text-white">{user?.firstName}</strong>
                  </p>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-center py-2 rounded-full border border-rose-500/50 text-rose-400 text-xs font-semibold hover:bg-rose-500/10"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-full bg-[#E5C07B] text-zinc-950 font-bold text-xs uppercase tracking-wider"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
