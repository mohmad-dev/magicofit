"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getCategories } from "@/lib/store-api";
import type { MedusaCategory } from "@/lib/types/medusa";
import { Menu, Search, ShoppingBag, Heart, User, Globe } from "lucide-react";
import Image from "next/image";
import MobileMenu from "./MobileMenu";
import { useUIStore } from "@/stores/ui-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import SearchModal from "@/components/search/SearchModal";

interface HeaderProps {
  initialCategories?: MedusaCategory[];
}

export default function Header({ initialCategories }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const isAr = locale === "ar";
  const t = useTranslations("common");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { openCart } = useUIStore();
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();
  const wishlistCount = useWishlistStore((s) => s.getItemCount());

  const safeCartCount = isMounted ? cartCount : 0;
  const safeWishlistCount = isMounted ? wishlistCount : 0;

  const switchLocale = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.push(pathname || "/", { locale: newLocale });
  };

  const [categories, setCategories] = useState<MedusaCategory[]>(
    initialCategories ? initialCategories.slice(0, 3) : []
  );

  useEffect(() => {
    setIsMounted(true);
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories.slice(0, 3));
      return;
    }
    let active = true;
    getCategories()
      .then((data) => {
        if (active && data) {
          setCategories(data.slice(0, 3));
        }
      })
      .catch((err) => console.error("Failed to load categories in header:", err));
    return () => { active = false; };
  }, [initialCategories]);

  const getCategoryName = (category: MedusaCategory) => {
    const key = category.handle.toLowerCase();
    const commonMapping: Record<string, string> = isAr ? {
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

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
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

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const navLinkClass = (active: boolean) =>
    `relative py-2 text-sm font-semibold transition-colors whitespace-nowrap rtl:tracking-normal tracking-wide uppercase ${
      active
        ? "text-white"
        : "text-neutral-300 hover:text-white"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full overflow-x-clip bg-[#0F1115]/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-[72px] items-center justify-between gap-2 sm:gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center flex-shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded"
            >
              <Image
                src="/images/logo.png"
                alt={isAr ? "الماجيكو للرياضة" : "MagicOFit"}
                width={148}
                height={42}
                priority
                className="h-7 sm:h-8 md:h-10 max-w-[125px] sm:max-w-[160px] md:max-w-none w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}
              className="hidden lg:flex items-center gap-7"
            >
              <Link href="/shop" className={navLinkClass(pathname === "/shop")}>
                {t("shop")}
                {pathname === "/shop" && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#D4AF37]" aria-hidden="true" />
                )}
              </Link>

              {categories.length > 0 ? (
                categories.map((category) => {
                  const catHref = `/shop/${category.handle}`;
                  const active = isActivePath(catHref);
                  return (
                    <Link key={category.id} href={catHref} className={navLinkClass(active)}>
                      {getCategoryName(category)}
                      {active && (
                        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#D4AF37]" aria-hidden="true" />
                      )}
                    </Link>
                  );
                })
              ) : (
                <Link href="/categories" className={navLinkClass(isActivePath("/categories"))}>
                  {t("categories")}
                  {isActivePath("/categories") && (
                    <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#D4AF37]" aria-hidden="true" />
                  )}
                </Link>
              )}

              <Link href="/brands" className={navLinkClass(isActivePath("/brands"))}>
                {t("brands")}
                {isActivePath("/brands") && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#D4AF37]" aria-hidden="true" />
                )}
              </Link>

              <Link href="/about" className={navLinkClass(isActivePath("/about"))}>
                {t("about")}
                {isActivePath("/about") && (
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#D4AF37]" aria-hidden="true" />
                )}
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1.5 flex-shrink-0">
              {/* Desktop Compact Search Pill */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center justify-between gap-4 h-11 min-w-[190px] lg:min-w-[220px] px-3.5 rounded-full bg-[#181B20] border border-white/15 hover:border-white/30 text-neutral-300 text-xs transition-colors cursor-pointer"
                aria-label={isAr ? "البحث عن منتجات" : "Search products"}
              >
                <span className="inline-flex items-center gap-2">
                  <Search className="h-4 w-4 text-neutral-400" />
                  <span>{isAr ? "ابحث عن منتج..." : "Search gear..."}</span>
                </span>
                <kbd className="font-latin text-[11px] font-semibold px-1.5 py-0.5 rounded bg-white/10 text-neutral-300">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-neutral-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label={isAr ? "بحث" : "Search products"}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/account/wishlist"
                className="relative inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
                aria-label={isAr ? "المفضلة" : "View wishlist"}
              >
                <Heart className="h-5 w-5" />
                {safeWishlistCount > 0 && (
                  <span className="font-latin absolute top-1.5 end-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white leading-none tabular-nums">
                    {safeWishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={openCart}
                className="relative inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-neutral-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label={`${isAr ? "سلة التسوق" : "Shopping cart"} (${safeCartCount})`}
              >
                <ShoppingBag className="h-5 w-5" />
                {safeCartCount > 0 && (
                  <span className="font-latin absolute top-1.5 end-1.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#D9480F] text-[10px] font-bold text-white leading-none tabular-nums">
                    {safeCartCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <Link
                href="/account"
                className="hidden lg:inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-200 hover:bg-white/10 hover:text-white transition-colors"
                aria-label={isAr ? "الحساب" : "View account"}
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Locale Switch */}
              <button
                type="button"
                onClick={switchLocale}
                className="hidden lg:inline-flex items-center gap-1.5 h-11 px-3 rounded-full bg-[#181B20] border border-white/15 hover:border-white/30 text-xs font-semibold text-neutral-200 hover:text-white transition-colors cursor-pointer"
                aria-label={isAr ? "التبديل للإنجليزية" : "Switch to Arabic"}
              >
                <Globe className="h-3.5 w-3.5 text-[#D4AF37]" />
                <span className={locale === "en" ? "" : "font-latin"}>
                  {locale === "en" ? t("arabic") : "EN"}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-neutral-200 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label={isAr ? "فتح القائمة" : "Open menu"}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartCount={safeCartCount}
        initialCategories={initialCategories}
      />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
