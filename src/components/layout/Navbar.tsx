'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  LogOut,
  Instagram,
  Youtube,
  Share2,
  Truck,
  Gem,
  ChevronDown,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useCategoryStore } from '../../store/categoryStore';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { setIsCartOpen, getTotalItemsCount, fetchCart, mergeGuestCart } =
    useCartStore();
  const { products: wishlistProducts, fetchWishlist } = useWishlistStore();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    checkAuth();
    fetchCart();
    fetchWishlist();
    fetchCategories();
  }, [checkAuth, fetchCart, fetchWishlist, fetchCategories]);

  useEffect(() => {
    if (isAuthenticated) {
      mergeGuestCart();
    }
  }, [isAuthenticated, mergeGuestCart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = getTotalItemsCount();
  const wishlistCount = wishlistProducts.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const shopDropdownItems = [
    { label: 'All Collections', href: '/shop' },
    ...categories.map((cat) => ({
      label: cat.name,
      href: `/shop?category=${cat.slug}`,
    })),
  ];

  const stitchingDropdownItems = [
    { label: 'All Stitching Services', href: '/stitching-services' },
    { label: 'Saree Blouse Stitching', href: '/stitching-services/saree-blouse-stitching' },
    { label: 'Bridal & Designer Blouses', href: '/stitching-services/bridal-designer-blouses' },
    { label: "Girls' Frocks & Gowns", href: '/stitching-services/girls-frocks-gowns' },
    { label: 'Pavadai Sattai & Pattu Pavadai', href: '/stitching-services/pavadai-sattai-pattu-pavadai' },
    { label: 'Lehenga Choli & Half Saree', href: '/stitching-services/lehenga-choli-half-saree' },
    { label: 'Kurti & Salwar Stitching', href: '/stitching-services/kurti-salwar-stitching' },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 01. TOP ANNOUNCEMENT BAR (Deep Royal Plum & 24K Gold)     */}
      {/* ========================================================= */}
      <div className="w-full max-w-full overflow-hidden bg-gradient-to-r from-[#2D051E] via-[#4B0B32] to-[#2D051E] text-[#FDF6EC] text-[11px] sm:text-xs py-1.5 px-3 sm:px-8 border-b border-[#D4AF37]/50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
          {/* Left Spacer on Desktop for true center alignment */}
          <div className="hidden lg:block w-44 shrink-0" />

          {/* Center Perks: Free Shipping Across India | Premium Quality | Stitched with Love */}
          <div className="flex-1 flex items-center justify-center gap-2.5 sm:gap-5 text-center whitespace-nowrap overflow-hidden">
            <span className="inline-flex items-center gap-1.5 text-[#FFF3D6] font-medium tracking-wide">
              <Truck className="w-3.5 h-3.5 text-[#F5C85B] shrink-0" />
              <span>Free Shipping Across India</span>
            </span>
            <span className="text-[#D4AF37]/70">|</span>
            <span className="inline-flex items-center gap-1.5 text-[#FFF3D6] font-medium tracking-wide">
              <Gem className="w-3.5 h-3.5 text-[#F5C85B] shrink-0" />
              <span>Premium Quality</span>
            </span>
            <span className="hidden sm:inline text-[#D4AF37]/70">|</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#FFF3D6] font-medium tracking-wide">
              <Heart className="w-3.5 h-3.5 text-[#F5C85B] fill-[#F5C85B] shrink-0" />
              <span>Stitched with Love</span>
            </span>
          </div>

          {/* Right Socials: Follow Us : [IG] [YT] [Pin] */}
          <div className="hidden md:flex items-center justify-end gap-2 text-[11px] text-[#FFF3D6] w-44 shrink-0">
            <span className="opacity-90 font-medium">Follow Us :</span>
            <div className="flex items-center gap-1.5">
              <a
                href="https://www.instagram.com/nalmarafashion"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded bg-gradient-to-b from-[#F5D37E]/25 to-[#C8912E]/25 border border-[#E5B85B]/75 text-[#FFE59E] hover:bg-[#D4AF37] hover:text-[#2A061C] flex items-center justify-center transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-3 h-3" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded bg-gradient-to-b from-[#F5D37E]/25 to-[#C8912E]/25 border border-[#E5B85B]/75 text-[#FFE59E] hover:bg-[#D4AF37] hover:text-[#2A061C] flex items-center justify-center transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-3 h-3" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded bg-gradient-to-b from-[#F5D37E]/25 to-[#C8912E]/25 border border-[#E5B85B]/75 text-[#FFE59E] hover:bg-[#D4AF37] hover:text-[#2A061C] flex items-center justify-center transition-all"
                aria-label="Pinterest"
              >
                <Share2 className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 02. MAIN HEADER BAR (Royal Champagne Silk & 24K Gold)     */}
      {/* ========================================================= */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-gradient-to-r from-[#F4DFC0] via-[#FFF9F0] to-[#F4DFC0] border-b-2 border-[#D4AF37] relative ${
          isScrolled
            ? 'shadow-[0_10px_30px_rgba(45,5,30,0.18)] py-2'
            : 'shadow-[0_4px_18px_rgba(90,45,15,0.08)] py-2.5 sm:py-3'
        }`}
      >
        {/* Top Inner Gold Hairline */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFFDF9] to-transparent pointer-events-none" />

        {/* Left & Right Ornamental Gold Filigree Watermarks */}
        <svg
          viewBox="0 0 160 80"
          fill="none"
          className="hidden xl:block absolute left-2 top-1/2 -translate-y-1/2 w-32 h-16 text-[#C8912E]/35 pointer-events-none"
        >
          <path
            d="M4 68 C28 52, 54 28, 108 12 M28 56 C24 34, 40 18, 60 16 M56 42 C54 24, 70 14, 88 12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="16" r="2.5" fill="currentColor" />
          <circle cx="88" cy="12" r="2" fill="currentColor" />
          <circle cx="108" cy="12" r="2.5" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 160 80"
          fill="none"
          className="hidden xl:block absolute right-2 top-1/2 -translate-y-1/2 w-32 h-16 text-[#C8912E]/35 pointer-events-none -scale-x-100"
        >
          <path
            d="M4 68 C28 52, 54 28, 108 12 M28 56 C24 34, 40 18, 60 16 M56 42 C54 24, 70 14, 88 12"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle cx="60" cy="16" r="2.5" fill="currentColor" />
          <circle cx="88" cy="12" r="2" fill="currentColor" />
          <circle cx="108" cy="12" r="2.5" fill="currentColor" />
        </svg>

        <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-10 flex items-center justify-between gap-4 relative z-10">
          {/* Left: Mobile Menu Button + Official Circular Emblem & Brand Title */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#2A0E1B] hover:bg-[#EED9BA]/60 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-3 sm:gap-3.5 group">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2.5px] bg-gradient-to-b from-[#FFF2B8] via-[#D4AF37] to-[#8C6518] shadow-[0_4px_14px_rgba(90,45,15,0.28)] group-hover:scale-105 transition-transform shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0E0B09] border border-[#FFF6D6]/50">
                  <img
                    src="/images/nalmara-logo.jpg"
                    alt="NALMARA FASHION"
                    className="w-full h-full object-cover scale-[1.34]"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-start leading-none">
                <span className="font-serif text-xl sm:text-[26px] font-bold tracking-[0.14em] text-[#23120B] uppercase drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]">
                  NALMARA
                </span>
                <div className="flex items-center gap-2 mt-1 w-full">
                  <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#8C6518]" />
                  <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.3em] text-[#5C3D1E] uppercase">
                    FASHION
                  </span>
                  <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#8C6518]" />
                </div>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links (Home | Shop v | Stitching Services v | About Us | Contact Us) */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-[14.5px] font-serif font-semibold text-[#23120B]">
            <Link
              href="/"
              className={`relative py-1.5 transition-colors hover:text-[#5B0E3D] ${
                pathname === '/'
                  ? 'text-[#5B0E3D] font-bold after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#C8912E] after:to-transparent'
                  : ''
              }`}
            >
              Home
            </Link>

            {/* Shop Dropdown */}
            <div className="relative group py-1.5">
              <Link
                href="/shop"
                className={`inline-flex items-center gap-1 hover:text-[#5B0E3D] transition-colors ${
                  pathname.startsWith('/shop') ? 'font-bold text-[#5B0E3D]' : ''
                }`}
              >
                <span>Shop</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C6518] group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-52 rounded-2xl bg-[#FFFDF9] border-[1.5px] border-[#D4AF37] shadow-[0_14px_32px_rgba(45,5,30,0.18)] py-2 px-1.5 font-sans">
                  {shopDropdownItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block px-3.5 py-2 rounded-xl text-xs font-semibold text-[#23120B] hover:bg-[#FAF0DF] hover:text-[#5B0E3D] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Stitching Services Dropdown */}
            <div className="relative group py-1.5">
              <Link
                href="/stitching-services"
                className={`inline-flex items-center gap-1 hover:text-[#5B0E3D] transition-colors ${
                  pathname.startsWith('/stitching-services')
                    ? 'font-bold text-[#5B0E3D] after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#C8912E] after:to-transparent'
                    : ''
                }`}
              >
                <span>Stitching Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C6518] group-hover:rotate-180 transition-transform" />
              </Link>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="w-64 rounded-2xl bg-[#FFFDF9] border-[1.5px] border-[#D4AF37] shadow-[0_14px_32px_rgba(45,5,30,0.18)] py-2 px-1.5 font-sans">
                  {stitchingDropdownItems.map((item) => {
                    const isItemActive = pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`block px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                          isItemActive
                            ? 'bg-gradient-to-r from-[#380725] to-[#5B0E3D] text-[#FFE59E]'
                            : 'text-[#23120B] hover:bg-[#FAF0DF] hover:text-[#5B0E3D]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <Link
              href="/about"
              className={`relative py-1.5 hover:text-[#5B0E3D] transition-colors ${
                pathname === '/about'
                  ? 'font-bold text-[#5B0E3D] after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#C8912E] after:to-transparent'
                  : ''
              }`}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={`relative py-1.5 hover:text-[#5B0E3D] transition-colors ${
                pathname === '/contact'
                  ? 'font-bold text-[#5B0E3D] after:content-[""] after:absolute after:bottom-0 after:inset-x-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#C8912E] after:to-transparent'
                  : ''
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right: Luxury Icon Medallions (Search, User, Wishlist Heart, Cart) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 text-[#23120B]">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] border border-[#D4AF37]/75 text-[#23120B] hover:text-[#5B0E3D] flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px] stroke-[2.2]" />
            </button>

            {/* User Account */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] border border-[#D4AF37]/75 text-[#23120B] hover:text-[#5B0E3D] flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105"
                  aria-label="User account"
                >
                  <UserIcon className="w-[18px] h-[18px] stroke-[2.2]" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] border border-[#D4AF37]/75 text-[#23120B] hover:text-[#5B0E3D] flex items-center justify-center shadow-xs transition-all hover:scale-105"
                  aria-label="Sign in"
                >
                  <UserIcon className="w-[18px] h-[18px] stroke-[2.2]" />
                </Link>
              )}

              {isUserMenuOpen && isAuthenticated && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#FFFDF9] border border-[#D4AF37]/70 rounded-2xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-[#D4AF37]/30">
                    <p className="font-serif font-bold text-[#23120B] truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-zinc-700 hover:bg-[#FAF3E3] hover:text-[#5B0E3D] font-medium"
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-4 py-2 text-zinc-700 hover:bg-[#FAF3E3] hover:text-[#5B0E3D] font-medium"
                  >
                    Order History
                  </Link>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-[#FAF3E3] flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Heart with Deep Royal Plum & Gold Badge */}
            <Link
              href="/wishlist"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] border border-[#D4AF37]/75 text-[#23120B] hover:text-[#5B0E3D] flex items-center justify-center shadow-xs transition-all hover:scale-105"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px] fill-[#23120B] text-[#23120B]" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-b from-[#7A124E] to-[#42062A] border border-[#FFE59E] text-[#FFFDF9] text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none shadow-sm">
                {wishlistCount}
              </span>
            </Link>

            {/* Cart with Deep Royal Plum & Gold Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFFDF9]/90 hover:bg-[#FFFDF9] border border-[#D4AF37]/75 text-[#23120B] hover:text-[#5B0E3D] flex items-center justify-center shadow-xs transition-all cursor-pointer hover:scale-105"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-[18px] h-[18px] fill-[#23120B] text-[#23120B]" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-b from-[#7A124E] to-[#42062A] border border-[#FFE59E] text-[#FFFDF9] text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center leading-none shadow-sm">
                {totalCartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="max-w-xl mx-auto px-4 pt-2.5 pb-1 animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="w-4 h-4 text-[#8C6518] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sarees, blouses, kidswear, lehengas..."
                className="w-full bg-[#FFFDF9] text-[#23120B] placeholder:text-zinc-400 text-xs pl-9 pr-20 py-2.5 rounded-full border border-[#D4AF37] focus:outline-none shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5B0E3D] to-[#3D0829] text-[#FFE59E] text-[10px] font-bold uppercase tracking-wider"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* MOBILE SLIDEOUT DRAWER                                    */}
      {/* ========================================================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FDF6EC] text-[#23120B] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-r-2 border-[#D4AF37]/60">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4AF37] bg-[#0E0B09]">
                    <img
                      src="/images/nalmara-logo.jpg"
                      alt="NALMARA FASHION"
                      className="w-full h-full object-cover scale-[1.34]"
                    />
                  </div>
                  <span className="font-serif font-bold text-base tracking-[0.14em] text-[#23120B]">
                    NALMARA
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-600 hover:text-[#23120B]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-2.5">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-serif font-bold text-[#23120B] hover:text-[#5B0E3D] py-1.5 border-b border-[#D4AF37]/25"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-serif font-bold text-[#23120B] hover:text-[#5B0E3D] py-1.5 border-b border-[#D4AF37]/25"
                >
                  Shop All Collections
                </Link>
                <div className="pl-3 space-y-1.5 py-1 border-b border-[#D4AF37]/25">
                  {shopDropdownItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-xs font-medium text-[#5C3D1E] hover:text-[#5B0E3D] py-1"
                    >
                      • {item.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/stitching-services"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-serif font-bold text-[#23120B] hover:text-[#5B0E3D] py-1.5 border-b border-[#D4AF37]/25"
                >
                  Stitching Services
                </Link>
                <div className="pl-3 space-y-1.5 py-1 border-b border-[#D4AF37]/25">
                  {stitchingDropdownItems.slice(1).map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-xs font-medium text-[#5C3D1E] hover:text-[#5B0E3D] py-1"
                    >
                      • {item.label}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-serif font-bold text-[#23120B] hover:text-[#5B0E3D] py-1.5 border-b border-[#D4AF37]/25"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-serif font-bold text-[#23120B] hover:text-[#5B0E3D] py-1.5 border-b border-[#D4AF37]/25"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="border-t border-[#D4AF37]/40 pt-4 text-xs">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-zinc-600">
                    Signed in as <strong className="text-[#23120B]">{user?.firstName}</strong>
                  </p>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="text-rose-600 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full py-2.5 text-center bg-gradient-to-r from-[#5B0E3D] to-[#3D0829] border border-[#D4AF37] text-[#FFE59E] rounded-full font-serif font-bold tracking-wider uppercase"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDF9] rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border-2 border-[#D4AF37]/60">
            <h3 className="font-serif text-lg font-bold text-[#23120B]">Sign Out</h3>
            <p className="text-xs text-zinc-600">
              Are you sure you want to sign out of your NALMARA FASHION account?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-full border border-[#D4AF37]/60 text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-full bg-[#3D0829] border border-[#D4AF37] text-[#FFE59E] hover:bg-[#5B0E3D]"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
