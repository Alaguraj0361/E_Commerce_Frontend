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
  LogOut,
  Instagram,
  Facebook,
  Youtube,
  Share2,
  Sparkles,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useCategoryStore } from '../../store/categoryStore';
import { BrandLogo } from '../ui/BrandLogo';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { setIsCartOpen, getTotalItemsCount, fetchCart, mergeGuestCart } =
    useCartStore();
  const { products: wishlistProducts, fetchWishlist } = useWishlistStore();
  const { user, isAuthenticated, checkAuth, logout } = useAuthStore();
  const { categories: liveCategories, fetchCategories } = useCategoryStore();

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
      setIsMobileSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/shop' },
    ...liveCategories.slice(0, 5).map((cat) => ({
      label: cat.name,
      href: `/shop?category=${cat.slug}`,
    })),
    { label: 'New Arrivals', href: '/shop?filter=new-arrivals' },
    { label: 'Best Sellers', href: '/shop?filter=best-sellers' },
    { label: 'About Us', href: '/about' },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 01. TOP ANNOUNCEMENT BAR (Royal Wine #180306 & 24K Gold)  */}
      {/* ========================================================= */}
      <div className="w-full max-w-full overflow-hidden bg-[#180306] text-[#FAF8F5] text-[10px] sm:text-[11px] py-2 px-3 sm:px-6 transition-colors border-b border-[#D4AF37]/45">
        <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-3 min-w-0">
          {/* Centered / Left Announcement */}
          <div className="flex-1 min-w-0 flex items-center justify-center lg:justify-start gap-2 sm:gap-3 text-center text-xs tracking-wider overflow-hidden">
            <Sparkles className="w-3 h-3 text-[#FFE59E] shrink-0" />
            <span className="font-serif font-medium truncate text-[10.5px] sm:text-xs text-[#FFE59E]">
              Free Insured Shipping Above ₹1,999
            </span>
            <span className="text-[#D4AF37]/70 text-[10px]">|</span>
            <span className="hidden sm:inline font-serif text-[#E8D5B0]">100% Verified Loom Quality</span>
            <span className="hidden lg:inline text-[#D4AF37]/70 text-[10px]">|</span>
            <a
              href="https://wa.me/916383163609"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline font-serif text-[#FFE59E] hover:underline"
            >
              WhatsApp Concierge: 6383163609 &bull; 7871207631
            </a>
          </div>

          {/* Right Socials */}
          <div className="hidden md:flex items-center gap-2.5 text-[11px] font-serif text-[#E8D5B0] shrink-0">
            <span className="text-[#FFE59E]/90">Follow us:</span>
            <div className="flex items-center gap-2.5 text-[#E8D5B0]">
              <a
                href="https://www.instagram.com/nalmarafashion"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFE59E] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFE59E] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFE59E] transition-colors"
                aria-label="Pinterest"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#FFE59E] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN HEADER (Ivory Cream #FAF7F2 with 24K Gold Trim)      */}
      {/* ========================================================= */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-[#FAF7F2] border-b border-[#D4AF37]/40 ${
          isScrolled ? 'shadow-[0_10px_30px_rgba(24,3,6,0.08)] py-2 backdrop-blur-md bg-[#FAF7F2]/95' : 'py-3'
        }`}
      >
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Mobile/Drawer Menu Toggle + Logo */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-[#180306] hover:text-[#5C0612] hover:bg-[#FAF3E3] border border-transparent hover:border-[#D4AF37]/50 transition-all rounded-full focus:outline-none cursor-pointer"
                aria-label="Open menu drawer"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Brand Logo */}
              <BrandLogo size="md" theme="light" showTagline={true} />
            </div>

            {/* Center: Search Bar (Luxury Gold-Trimmed Pill) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-lg lg:max-w-xl mx-4 relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sarees, Kanchivaram silks, festive wear..."
                className="w-full bg-[#FFFDF9] text-[#180306] placeholder:text-zinc-400 text-xs px-5 py-2.5 pr-11 rounded-full border border-[#D4AF37]/60 focus:outline-none focus:ring-2 focus:ring-[#5C0612]/20 focus:border-[#5C0612] transition-all shadow-2xs font-normal"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#180306] hover:bg-[#5C0612] text-[#FFE59E] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Right: Icons (Search, User, Wishlist, Cart) */}
            <div className="flex items-center gap-2 sm:gap-3.5 text-[#180306]">
              {/* Search Button (Toggles search on mobile) */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-2 rounded-full hover:bg-[#FAF3E3] text-[#180306] hover:text-[#5C0612] transition-colors md:hidden"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account - hidden on extra small mobile, visible on sm+ */}
              <div className="relative hidden sm:block">
                {isAuthenticated ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/55 hover:border-[#5C0612] text-[#180306] hover:text-[#5C0612] transition-all flex items-center justify-center shadow-2xs cursor-pointer"
                    aria-label="User account"
                  >
                    <UserIcon className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/55 hover:border-[#5C0612] text-[#180306] hover:text-[#5C0612] transition-all flex items-center justify-center shadow-2xs"
                    aria-label="Sign in"
                  >
                    <UserIcon className="w-4 h-4" />
                  </Link>
                )}

                {/* User Dropdown */}
                {isUserMenuOpen && isAuthenticated && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#FFFDF9] border border-[#D4AF37]/60 rounded-2xl shadow-xl py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2.5 border-b border-[#D4AF37]/30">
                      <p className="font-serif font-bold text-[#180306] truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-zinc-700 hover:bg-[#FAF3E3] hover:text-[#5C0612] font-medium"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-zinc-700 hover:bg-[#FAF3E3] hover:text-[#5C0612] font-medium"
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

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative w-9 h-9 rounded-full bg-[#FFFDF9] border border-[#D4AF37]/55 hover:border-[#5C0612] text-[#180306] hover:text-[#5C0612] transition-all hidden sm:flex items-center justify-center shadow-2xs"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#5C0612] border border-[#D4AF37] text-[#FFE59E] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button with Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-9 h-9 rounded-full bg-[#180306] hover:bg-[#4A0812] border border-[#D4AF37] text-[#FFE59E] transition-all flex items-center justify-center shadow-sm cursor-pointer"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-[#180306] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-2xs">
                  {totalCartCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Search Form */}
          {isMobileSearchOpen && (
            <div className="md:hidden pt-3 pb-1 animate-fade-in">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for sarees, fabrics, collections..."
                  className="w-full bg-white text-[#180306] placeholder:text-zinc-400 text-xs px-4 py-2.5 pr-10 rounded-full border border-[#D4AF37]/70 focus:outline-none focus:ring-2 focus:ring-[#5C0612]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#180306] hover:text-[#5C0612]"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SUB-NAVIGATION BAR (Desktop Centered Links)               */}
        {/* ========================================================= */}
        <nav className="hidden lg:block border-t border-[#D4AF37]/30 mt-2.5 pt-2.5 pb-1">
          <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-center gap-8 xl:gap-11 text-xs font-serif font-semibold tracking-[0.14em] uppercase text-[#2A1810]">
            {navLinks.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href.split('?')[0]);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative py-1 transition-colors hover:text-[#5C0612] ${
                    isActive ? 'text-[#5C0612] font-bold' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5C0612] via-[#D4AF37] to-[#5C0612] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
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
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FAF7F2] text-zinc-900 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-r-2 border-[#D4AF37]/60">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#D4AF37]/35">
                <BrandLogo size="sm" theme="light" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-500 hover:text-[#180306]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5 space-y-3">
                {navLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-sm font-serif font-semibold text-[#180306] hover:text-[#5C0612] py-1.5 border-b border-[#D4AF37]/25"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-[#D4AF37]/35 pt-5 space-y-3 text-xs">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-zinc-500">
                    Signed in as <strong className="text-[#180306]">{user?.firstName}</strong>
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
                  className="block w-full py-2.5 text-center bg-[#180306] border border-[#D4AF37] text-[#FFE59E] rounded-full font-serif font-bold tracking-wider uppercase"
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
            <h3 className="font-serif text-lg font-bold text-[#180306]">Sign Out</h3>
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
                className="flex-1 py-2 text-xs font-semibold rounded-full bg-[#180306] border border-[#D4AF37] text-[#FFE59E] hover:bg-[#4A0812]"
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
