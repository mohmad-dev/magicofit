"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Heart, User, ShoppingBag, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { checkAuthStatus } from "@/actions/auth";
import { getCategories } from "@/lib/store-api";
import type { MedusaCategory } from "@/lib/types/medusa";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
  initialCategories?: MedusaCategory[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  cartCount = 0,
  initialCategories,
}: MobileMenuProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("shop");
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("mobileMenu");
  const tc = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const isAr = locale === "ar";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [categories, setCategories] = useState<MedusaCategory[]>(
    initialCategories ? initialCategories.slice(0, 6) : []
  );

  useEffect(() => {
    if (!isOpen) return;
    let active = true;

    checkAuthStatus()
      .then(({ authenticated }) => {
        if (active) setIsLoggedIn(authenticated);
      })
      .catch((err) => console.error("Mobile menu auth check failed:", err));

    if (!initialCategories || initialCategories.length === 0) {
      getCategories()
        .then((data) => {
          if (active && data) {
            setCategories(data.slice(0, 6));
          }
        })
        .catch((err) => console.error("Failed to load categories in mobile menu:", err));
    }

    return () => {
      active = false;
    };
  }, [isOpen, initialCategories]);

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
    onClose();
    router.push(pathname || "/", { locale: newLocale });
  };

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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={menuRef}
        className="fixed inset-y-0 end-0 flex flex-col w-full max-w-sm bg-[#F7F7F5] shadow-2xl border-s border-white/10"
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
      >
        {/* Obsidian Top Bar */}
        <div className="flex items-center justify-between bg-[#0E1014] text-white border-b border-white/10 px-4 h-16 flex-shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center">
            <Image
              src="/images/logo.png"
              alt={isAr ? "الماجيكو للرياضة" : "MagicOFit"}
              width={120}
              height={34}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-neutral-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label={isAr ? "إغلاق القائمة" : "Close menu"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 border-b border-border-subtle bg-white p-2 flex-shrink-0">
          <Link
            href="/search"
            className="flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-md text-ink-secondary hover:text-primary-600 hover:bg-surface-subtle transition-colors"
            onClick={onClose}
            aria-label={tc("search")}
          >
            <Search className="h-5 w-5" />
            <span className="text-[11px] font-semibold">{tc("search")}</span>
          </Link>
          <Link
            href="/account/wishlist"
            className="flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-md text-ink-secondary hover:text-primary-600 hover:bg-surface-subtle transition-colors"
            onClick={onClose}
            aria-label={tc("wishlist")}
          >
            <Heart className="h-5 w-5" />
            <span className="text-[11px] font-semibold">{tc("wishlist")}</span>
          </Link>
          <Link
            href="/account"
            className="flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-md text-ink-secondary hover:text-primary-600 hover:bg-surface-subtle transition-colors"
            onClick={onClose}
            aria-label={tc("account")}
          >
            <User className="h-5 w-5" />
            <span className="text-[11px] font-semibold">{tc("account")}</span>
          </Link>
          <Link
            href="/cart"
            className="relative flex flex-col items-center justify-center gap-1 min-h-[56px] rounded-md text-ink-secondary hover:text-primary-600 hover:bg-surface-subtle transition-colors"
            onClick={onClose}
            aria-label={`${tc("cart")} (${cartCount})`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-[11px] font-semibold">{tc("cart")}</span>
            {cartCount > 0 && (
              <span className="font-latin absolute top-1.5 end-4 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white leading-none" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Shop Section */}
          <div className="border-b border-border-subtle">
            <button
              type="button"
              onClick={() => toggleSection("shop")}
              className="flex w-full min-h-[48px] items-center justify-between px-4 py-3 font-bold text-sm text-ink-primary cursor-pointer"
              aria-expanded={expandedSection === "shop"}
              aria-controls="shop-menu"
            >
              <span>{t("shop")}</span>
              {expandedSection === "shop" ? (
                <ChevronUp className="h-4 w-4 text-ink-secondary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-ink-secondary" />
              )}
            </button>
            {expandedSection === "shop" && (
              <div id="shop-menu" className="bg-surface-subtle/70 px-4 py-2 space-y-1">
                <Link
                  href="/shop"
                  className="flex items-center min-h-[44px] py-2 text-sm text-ink-primary hover:text-primary-600 font-semibold"
                  onClick={onClose}
                >
                  {t("allProducts")}
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/shop/${category.handle}`}
                    className="flex items-center min-h-[44px] py-2 text-sm text-ink-secondary hover:text-primary-600 font-medium"
                    onClick={onClose}
                  >
                    {getCategoryName(category)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Categories Direct Link */}
          <div className="border-b border-border-subtle">
            <Link
              href="/categories"
              className="flex min-h-[48px] items-center px-4 py-3 font-bold text-sm text-ink-primary hover:text-primary-600 transition-colors"
              onClick={onClose}
            >
              {t("categories")}
            </Link>
          </div>

          {/* Brands Direct Link */}
          <div className="border-b border-border-subtle">
            <Link
              href="/brands"
              className="flex min-h-[48px] items-center px-4 py-3 font-bold text-sm text-ink-primary hover:text-primary-600 transition-colors"
              onClick={onClose}
            >
              {t("brands")}
            </Link>
          </div>

          {/* Support Section */}
          <div className="border-b border-border-subtle">
            <button
              type="button"
              onClick={() => toggleSection("support")}
              className="flex w-full min-h-[48px] items-center justify-between px-4 py-3 font-bold text-sm text-ink-primary cursor-pointer"
              aria-expanded={expandedSection === "support"}
              aria-controls="support-menu"
            >
              <span>{t("support")}</span>
              {expandedSection === "support" ? (
                <ChevronUp className="h-4 w-4 text-ink-secondary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-ink-secondary" />
              )}
            </button>
            {expandedSection === "support" && (
              <div id="support-menu" className="bg-surface-subtle/70 px-4 py-2 space-y-1">
                <Link
                  href="/about"
                  className="flex items-center min-h-[44px] py-2 text-sm text-ink-secondary hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {t("aboutUs")}
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center min-h-[44px] py-2 text-sm text-ink-secondary hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {t("contactUs")}
                </Link>
                <Link
                  href="/faq"
                  className="flex items-center min-h-[44px] py-2 text-sm text-ink-secondary hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {tc("faq")}
                </Link>
                <Link
                  href="/shipping"
                  className="flex items-center min-h-[44px] py-2 text-sm text-ink-secondary hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {t("shippingInfo")}
                </Link>
                <Link
                  href="/returns"
                  className="flex items-center min-h-[44px] py-2 text-sm text-ink-secondary hover:text-primary-600 font-medium"
                  onClick={onClose}
                >
                  {tc("returns")}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border-subtle bg-white p-4 space-y-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={switchLocale}
            className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-md border border-border-subtle px-4 py-2.5 text-sm text-ink-primary font-semibold hover:bg-surface-subtle transition-colors cursor-pointer"
          >
            <Globe className="h-4 w-4 text-[#A68132]" />
            <span>{locale === "en" ? tc("arabic") : tc("english")}</span>
          </button>
          {!isLoggedIn && (
            <Link
              href="/account"
              className="flex items-center justify-center gap-2 w-full min-h-[44px] rounded-md bg-[#0E1014] px-4 py-2.5 text-sm text-white font-semibold hover:bg-[#171A21] transition-colors"
              onClick={onClose}
            >
              <User className="h-4 w-4 text-[#E5C573]" />
              <span>{t("signInRegister")}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
