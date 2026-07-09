"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCategories } from "@/lib/store-api";
import type { MedusaCategory } from "@/lib/types/medusa";
import { useState, useEffect } from "react";

// Custom icons since lucide-react doesn't have social media icons
const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.84a8.28 8.28 0 004.76 1.5V6.89a4.85 4.85 0 01-1-.2z"/>
  </svg>
);

export default function Footer() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/ar") ? "ar" : "en";
  const t = useTranslations("footer");
  const tc = useTranslations("common");

  const [categories, setCategories] = useState<MedusaCategory[]>([]);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((data) => {
        if (active && data) {
          setCategories(data.slice(0, 4));
        }
      })
      .catch((err) => console.error("Failed to load categories in footer:", err));
    return () => { active = false; };
  }, []);

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

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <Image
                src="/images/logo.png"
                alt="MagicOFit"
                width={140}
                height={36}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="mb-4 text-sm text-neutral-700 leading-relaxed">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/18hLJiTUda/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تابعنا على فيسبوك"
                className="text-neutral-600 transition-colors hover:text-primary-700 hover:scale-110 transform"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.tiktok.com/@almageko58"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تابعنا على تيك توك"
                className="text-neutral-600 transition-colors hover:text-primary-700 hover:scale-110 transform"
              >
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-outfit mb-4 font-bold text-neutral-900 uppercase tracking-wide">
              {t('shop')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-neutral-700 transition-colors hover:text-primary-700 font-medium"
                >
                  {t('allProducts')}
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/shop/${category.handle}`}
                    className="text-neutral-700 transition-colors hover:text-primary-700 font-medium"
                  >
                    {getCategoryName(category)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-outfit mb-4 font-bold text-neutral-900 uppercase tracking-wide">
              {t('support')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-neutral-700 transition-colors hover:text-primary-700 font-medium"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-700 transition-colors hover:text-primary-700 font-medium"
                >
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-neutral-700 transition-colors hover:text-primary-700 font-medium"
                >
                  {tc('faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-neutral-700 transition-colors hover:text-primary-700 font-medium"
                >
                  {t('shippingInfo')}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-neutral-700 transition-colors hover:text-primary-700 font-medium"
                >
                  {tc('returns')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col space-y-4" dir={locale === "ar" ? "rtl" : "ltr"}>
            <h3 className="font-outfit font-bold text-neutral-900 uppercase tracking-wide">
              {locale === "ar" ? "اتصل بنا" : "Contact Us"}
            </h3>
            <ul className="space-y-3 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <span className="font-bold">{locale === "ar" ? "العنوان:" : "Address:"}</span>
                <span>{locale === "ar" ? "بني سويف، بجوار قاعة القصر" : "Beni Suef, Next to Palace Hall"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold">{locale === "ar" ? "واتساب:" : "WhatsApp:"}</span>
                <a href="https://wa.me/201009784410" className="text-primary-700 hover:text-primary-800 font-bold" dir="ltr">
                  +20 100 978 4410
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-bold">{locale === "ar" ? "تيك توك:" : "TikTok:"}</span>
                <a href="https://www.tiktok.com/@almageko58?_r=1&_t=ZS-97tHN5U77An" target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:text-primary-800 font-semibold">
                  @almageko58
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-700">
          <p>{t('copyright')}</p>
          <p className="mt-2">
            التطوير بواسطة: <span className="font-bold text-neutral-900">محمد أحمد مرعي</span> |{" "}
            <a
              href="https://wa.me/201091998631"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
            >
              {locale === "ar" ? (
                <>
                  واتساب: <span dir="ltr">01091998631</span>
                </>
              ) : (
                "WhatsApp: 01091998631"
              )}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
