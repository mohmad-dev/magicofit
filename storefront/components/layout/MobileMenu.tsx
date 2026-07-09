"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Heart, User, ShoppingBag, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { checkAuthStatus } from "@/actions/auth";
import { getCategories } from "@/lib/store-api";
import type { MedusaCategory } from "@/lib/types/medusa";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
}

export default function MobileMenu({ isOpen, onClose, cartCount = 0 }: MobileMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("mobileMenu");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState<MedusaCategory[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const checkAuth = async () => {
      try {
        const { authenticated } = await checkAuthStatus();
        setIsLoggedIn(authenticated);
      } catch (err) {
        console.error("Mobile menu auth check failed:", err);
      }
    };
    checkAuth();

    // Fetch categories dynamically
    getCategories()
      .then((data) => {
        if (data) {
          setCategories(data.slice(0, 5));
        }
      })
      .catch((err) => console.error("Failed to load categories in mobile menu:", err));
  }, [isOpen]);

  const getCategoryName = (category: MedusaCategory) => {
    const key = category.handle.toLowerCase();
    const commonMapping: Record<string, string> = locale === "ar" ? {
      "running": "الجري",
      "football": "كرة القدم",
      "soccer": "كرة القدم",
      "basketball": "كرة السلة",
      "gym": "الجيم واللياقة",
      "training": "التدريب",
      "tennis": "التنس",
    } : {
      "running": "Running",
      "football": "Football",
      "soccer": "Football",
      "basketball": "Basketball",
      "gym": "Gym & Fitness",
      "training": "Training",
      "tennis": "Tennis",
    };
    return commonMapping[key] || category.name;
  };

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const currentPath = pathname.replace(/^\/(en|ar)/, "") || "/";
    onClose();
    router.push(`/${newLocale}${currentPath === "/" ? "" : currentPath}`);
  };

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const menu = menuRef.current;
    if (!menu) return;

    const focusableElements = menu.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    firstElement?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    menu.addEventListener("keydown", handleTab);
    document.addEventListener("keydown", handleEscape);

    return () => {
      menu.removeEventListener("keydown", handleTab);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu */}
      <div 
        ref={menuRef}
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl animate-in slide-in-from-right"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="font-outfit text-lg font-extrabold text-neutral-900 uppercase tracking-tight">
            {t('menu')}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-neutral-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-neutral-700" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-around border-b border-neutral-200 p-4">
          <Link
            href="/search"
            className="flex flex-col items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors min-w-[64px] min-h-[64px] flex items-center justify-center"
            onClick={onClose}
            aria-label="Search products"
          >
            <Search className="h-6 w-6" />
            <span className="text-xs font-medium">{tc('search')}</span>
          </Link>
          <Link
            href="/account/wishlist"
            className="flex flex-col items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors min-w-[64px] min-h-[64px] flex items-center justify-center"
            onClick={onClose}
            aria-label="View wishlist"
          >
            <Heart className="h-6 w-6" />
            <span className="text-xs font-medium">{tc('wishlist')}</span>
          </Link>
          <Link
            href="/account"
            className="flex flex-col items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors min-w-[64px] min-h-[64px] flex items-center justify-center"
            onClick={onClose}
            aria-label="View account"
          >
            <User className="h-6 w-6" />
            <span className="text-xs font-medium">{tc('account')}</span>
          </Link>
          <Link
            href="/cart"
            className="flex flex-col items-center gap-1 text-neutral-600 hover:text-primary-600 transition-colors relative min-w-[64px] min-h-[64px] flex items-center justify-center"
            onClick={onClose}
            aria-label={`View cart with ${cartCount} items`}
          >
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xs font-medium">{tc('cart')}</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="overflow-y-auto py-4">
          {/* Shop Section */}
          <div className="border-b border-neutral-100">
            <button
              onClick={() => toggleSection("shop")}
              className="flex w-full items-center justify-between px-4 py-3 font-semibold text-neutral-900"
              aria-expanded={expandedSection === "shop"}
              aria-controls="shop-menu"
            >
              {t('shop')}
              {expandedSection === "shop" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSection === "shop" && (
              <div id="shop-menu" className="bg-neutral-50 px-4 py-2 space-y-2">
                <Link
                  href="/shop"
                  className="block py-2 text-sm text-neutral-600 hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {t('allProducts')}
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop/${category.handle}`}
                    className="block py-2 text-sm text-neutral-600 hover:text-primary-600 font-medium"
                    onClick={onClose}
                  >
                    {getCategoryName(category)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Categories Section */}
          <div className="border-b border-neutral-100">
            <button
              onClick={() => toggleSection("categories")}
              className="flex w-full items-center justify-between px-4 py-3 font-semibold text-neutral-900"
              aria-expanded={expandedSection === "categories"}
              aria-controls="categories-menu"
            >
              {t('categories')}
              {expandedSection === "categories" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSection === "categories" && (
              <div id="categories-menu" className="bg-neutral-50 px-4 py-2 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop/${category.handle}`}
                    className="block py-2 text-sm text-neutral-600 hover:text-primary-600 font-medium"
                    onClick={onClose}
                  >
                    {getCategoryName(category)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Support Section */}
          <div className="border-b border-neutral-100">
            <button
              onClick={() => toggleSection("support")}
              className="flex w-full items-center justify-between px-4 py-3 font-semibold text-neutral-900"
              aria-expanded={expandedSection === "support"}
              aria-controls="support-menu"
            >
              {t('support')}
              {expandedSection === "support" ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSection === "support" && (
              <div id="support-menu" className="bg-neutral-50 px-4 py-2 space-y-2">
                <Link
                  href="/about"
                  className="block py-2 text-sm text-neutral-600 hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {t('aboutUs')}
                </Link>
                <Link
                  href="/contact"
                  className="block py-2 text-sm text-neutral-600 hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {t('contactUs')}
                </Link>
                <Link
                  href="/faq"
                  className="block py-2 text-sm text-neutral-600 hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {tc('faq')}
                </Link>
                <Link
                  href="/shipping"
                  className="block py-2 text-sm text-neutral-600 hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {t('shippingInfo')}
                </Link>
                <Link
                  href="/returns"
                  className="block py-2 text-sm text-neutral-600 hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {tc('returns')}
                </Link>
              </div>
            )}
          </div>

          {/* Simple Links */}
          <div className="border-b border-neutral-100">
            <Link
              href="/brands"
              className="flex items-center px-4 py-3 font-semibold text-neutral-900 hover:text-primary-600 transition-colors"
              onClick={onClose}
            >
              {t('brands')}
            </Link>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200 bg-neutral-50 p-4 space-y-3">
          <button
            onClick={switchLocale}
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-neutral-300 px-4 py-3 text-neutral-700 font-semibold hover:bg-neutral-100 transition-colors"
          >
            <Globe className="h-5 w-5" />
            {locale === "en" ? tc('arabic') : tc('english')}
          </button>
          {!isLoggedIn && (
            <Link
              href="/account"
              className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-3 text-white font-semibold hover:bg-neutral-800 transition-colors"
              onClick={onClose}
            >
              <User className="h-5 w-5" />
              {t('signInRegister')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
