"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Menu, Search, ShoppingBag, Heart, User, Globe } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/Button";
import MobileMenu from "./MobileMenu";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import SearchModal from "@/components/search/SearchModal";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("common");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { openCart } = useUIStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();
  const wishlistCount = useWishlistStore((s) => s.getItemCount());

  const locale = pathname.startsWith("/ar") ? "ar" : "en";

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const currentPath = pathname.replace(/^\/(en|ar)/, "") || "/";
    router.push(`/${newLocale}${currentPath === "/" ? "" : currentPath}`);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  if (!isMounted) {
    // Return a shell that matches server render (cart item count = 0)
    return (
      <>
        <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-lg">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 group">
                <Image
                  src="/images/logo.png"
                  alt="MagicOFit"
                  width={224}
                  height={56}
                  className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                <Link href="/shop" className="text-sm font-semibold text-neutral-700 transition-colors hover:text-primary-600 uppercase tracking-wide">{t('shop')}</Link>
                <Link href="/categories" className="text-sm font-semibold text-neutral-700 transition-colors hover:text-primary-600 uppercase tracking-wide">{t('categories')}</Link>
                <Link href="/brands" className="text-sm font-semibold text-neutral-700 transition-colors hover:text-primary-600 uppercase tracking-wide">{t('brands')}</Link>
                <Link href="/about" className="text-sm font-semibold text-neutral-700 transition-colors hover:text-primary-600 uppercase tracking-wide">{t('about')}</Link>
              </nav>

              {/* Right Actions */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="relative hover:bg-neutral-100">
                  <ShoppingBag className="h-5 w-5 text-neutral-700" />
                </Button>
              </div>
            </div>
          </div>
        </header>
      </>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/images/logo.png"
                alt="MagicOFit"
                width={224}
                height={56}
                className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                href="/shop"
                className="text-sm font-semibold text-neutral-700 transition-colors hover:text-primary-600 uppercase tracking-wide"
              >
                {t('shop')}
              </Link>
              <Link
                href="/categories"
                className="text-sm font-semibold text-neutral-700 transition-colors hover:text-primary-600 uppercase tracking-wide"
              >
                {t('categories')}
              </Link>
              <Link
                href="/brands"
                className="text-sm font-semibold text-neutral-700 transition-colors hover:text-primary-600 uppercase tracking-wide"
              >
                {t('brands')}
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold text-neutral-700 transition-colors hover:text-primary-600 uppercase tracking-wide"
              >
                {t('about')}
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="hidden lg:flex h-11 w-11 hover:bg-neutral-100" onClick={() => setIsSearchOpen(true)} aria-label="Search products">
                <Search className="h-5 w-5 text-neutral-700" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden lg:flex h-11 w-11 hover:bg-neutral-100 relative" onClick={() => router.push("/account/wishlist")} aria-label="View wishlist">
                <Heart className="h-5 w-5 text-neutral-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="hidden lg:flex h-11 w-11 hover:bg-neutral-100" onClick={() => router.push("/account")} aria-label="View account">
                <User className="h-5 w-5 text-neutral-700" />
              </Button>
              <Button variant="ghost" size="icon" className="flex lg:hidden h-11 w-11 hover:bg-neutral-100" onClick={() => setIsSearchOpen(true)} aria-label="Search products">
                <Search className="h-5 w-5 text-neutral-700" />
              </Button>
              <Button variant="ghost" size="icon" className="flex lg:hidden h-11 w-11 hover:bg-neutral-100 relative" onClick={() => router.push("/account/wishlist")} aria-label="View wishlist">
                <Heart className="h-5 w-5 text-neutral-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" className="relative h-11 w-11 hover:bg-neutral-100" onClick={openCart} aria-label={`Shopping cart with ${cartCount} items`}>
                <ShoppingBag className="h-5 w-5 text-neutral-700" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white shadow-lg" aria-hidden="true">
                    {cartCount}
                  </span>
                )}
              </Button>
              {/* Language Switcher */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden lg:flex h-11 gap-2 hover:bg-neutral-100 font-medium"
                onClick={switchLocale}
              >
                <Globe className="h-4 w-4" />
                {locale === "en" ? t('arabic') : t('english')}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-11 w-11 hover:bg-neutral-100"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-neutral-700" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartCount={cartCount}
      />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
