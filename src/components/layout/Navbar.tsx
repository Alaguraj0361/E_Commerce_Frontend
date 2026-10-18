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
      setIsMobileSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Sarees', href: '/shop?category=sarees' },
    { label: 'New Arrivals', href: '/shop?filter=new-arrivals' },
    { label: 'Best Sellers', href: '/shop?filter=best-sellers' },
    { label: 'Festive Collection', href: '/shop?category=festive' },
    { label: 'Kidswear', href: '/shop?category=kids-wear' },
    { label: 'Offers', href: '/shop?filter=offers' },
    { label: 'About Us', href: '/about' },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 01. TOP ANNOUNCEMENT BAR (Deep Pine Green #132E27)        */}
      {/* ========================================================= */}
      <div className="w-full max-w-full overflow-hidden bg-[#132E27] text-[#FAF8F5] text-[10px] sm:text-[11px] py-2 px-3 sm:px-6 transition-colors border-b border-[#0D201B]">
        <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-3 min-w-0">
          {/* Centered / Left Announcement */}
          <div className="flex-1 min-w-0 flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2.5 text-center text-xs tracking-wider overflow-hidden">
            <span className="text-[#D4AF37] text-xs">✦</span>
            <span className="font-light truncate text-[10px] sm:text-xs text-zinc-100">
              Free Shipping on Orders Above 1999
            </span>
            <span className="text-[#D4AF37] opacity-80 text-[10px]">|</span>
            <span className="hidden sm:inline font-light text-zinc-200">Easy Returns</span>
            <span className="hidden sm:inline text-[#D4AF37] opacity-80 text-[10px]">|</span>
            <span className="hidden sm:inline font-light text-zinc-200">Made with Love</span>
          </div>

          {/* Right Socials */}
          <div className="hidden md:flex items-center gap-2.5 text-[11px] font-light text-zinc-200 shrink-0">
            <span className="text-zinc-300">Follow us:</span>
            <div className="flex items-center gap-2 text-zinc-300">
              <a
                href="https://instagram.com/nalmarafashion_official"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors"
                aria-label="Pinterest"
              >
                <Share2 className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN HEADER (Ivory Cream #FAF7F2 matching Mockup)         */}
      {/* ========================================================= */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 bg-[#FAF7F2] border-b border-[#E8E2D5] ${
          isScrolled ? 'shadow-md py-2 backdrop-blur-md bg-[#FAF7F2]/95' : 'py-3'
        }`}
      >
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between gap-6">
            {/* Left: Mobile/Drawer Menu Toggle + Logo */}
            <div className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-zinc-700 hover:text-[#4A0E17] transition-colors rounded-md focus:outline-none cursor-pointer"
                aria-label="Open menu drawer"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Brand Logo */}
              <BrandLogo size="md" theme="light" showTagline={true} />
            </div>

            {/* Center: Search Bar (Rounded Pill with Search icon) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-lg lg:max-w-xl mx-4 relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sarees, fabrics, collections..."
                className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 text-xs px-5 py-2.5 pr-11 rounded-full border border-[#D9D1C2] focus:outline-none focus:ring-2 focus:ring-[#4A0E17]/25 focus:border-[#4A0E17] transition-all shadow-2xs font-light"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#4A0E17] transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Right: Icons (Search, User, Wishlist, Cart) */}
            <div className="flex items-center gap-2 sm:gap-5 text-zinc-700">
              {/* Search Button (Toggles search on mobile) */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="p-1.5 text-zinc-700 hover:text-[#4A0E17] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account - hidden on extra small mobile, visible on sm+ */}
              <div className="relative hidden sm:block">
                {isAuthenticated ? (
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-1.5 text-zinc-700 hover:text-[#4A0E17] transition-colors flex items-center"
                    aria-label="User account"
                  >
                    <UserIcon className="w-5 h-5" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="p-1.5 text-zinc-700 hover:text-[#4A0E17] transition-colors flex items-center"
                    aria-label="Sign in"
                  >
                    <UserIcon className="w-5 h-5" />
                  </Link>
                )}

                {/* User Dropdown */}
                {isUserMenuOpen && isAuthenticated && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-[#E8E2D5] rounded-xl shadow-xl py-2 z-50 animate-fade-in text-xs">
                    <div className="px-4 py-2 border-b border-[#E8E2D5]">
                      <p className="font-semibold text-zinc-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/account"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-zinc-700 hover:bg-[#FAF7F2] hover:text-[#4A0E17]"
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-zinc-700 hover:bg-[#FAF7F2] hover:text-[#4A0E17]"
                    >
                      Order History
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-[#FAF7F2] flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Wishlist Link - hidden on extra small mobile, visible on sm+ */}
              <Link
                href="/wishlist"
                className="relative p-1.5 text-zinc-700 hover:text-[#4A0E17] transition-colors hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute 0 top-0 -right-1 bg-[#4A0E17] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button with Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-zinc-700 hover:text-[#4A0E17] transition-colors"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute 0 top-0 -right-1 bg-[#4A0E17] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
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
                  className="w-full bg-white text-zinc-900 placeholder:text-zinc-400 text-xs px-4 py-2.5 pr-10 rounded-full border border-[#D9D1C2] focus:outline-none focus:ring-2 focus:ring-[#4A0E17]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#4A0E17]"
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
        <nav className="hidden lg:block border-t border-[#E8E2D5] mt-2.5 pt-2.5 pb-1">
          <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-center gap-8 xl:gap-12 text-xs font-serif tracking-wider uppercase text-zinc-800">
            {navLinks.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href.split('?')[0]);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative py-1 transition-colors hover:text-[#4A0E17] ${
                    isActive ? 'text-[#4A0E17] font-semibold' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A0E17] rounded-full" />
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
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FAF7F2] text-zinc-900 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#E8E2D5]">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#E8E2D5]">
                <BrandLogo size="sm" theme="light" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-900"
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
                    className="block text-sm font-medium text-zinc-800 hover:text-[#4A0E17] py-1 border-b border-zinc-200/50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-[#E8E2D5] pt-5 space-y-3 text-xs">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <p className="text-zinc-500">
                    Signed in as <strong className="text-zinc-800">{user?.firstName}</strong>
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
                  className="block w-full py-2.5 text-center bg-[#4A0E17] text-white rounded-full font-semibold"
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
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-zinc-200">
            <h3 className="font-serif text-lg font-bold text-zinc-900">Sign Out</h3>
            <p className="text-xs text-zinc-600">
              Are you sure you want to sign out of your NALMARA FASHION account?
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-full border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  logout();
                  setShowLogoutConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-full bg-[#4A0E17] text-white hover:bg-[#5E141F]"
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
