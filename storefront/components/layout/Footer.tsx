"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("footer");
  const tc = useTranslations("common");

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 font-bold text-white shadow-lg shadow-primary-500/30">
                M
              </div>
              <span className="font-outfit text-xl font-extrabold text-neutral-900 uppercase tracking-tight">
                MagicOFit
              </span>
            </div>
            <p className="mb-4 text-sm text-neutral-600 leading-relaxed">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/18hLJiTUda/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-primary-600 hover:scale-110 transform"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://www.tiktok.com/@almageko58"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 transition-colors hover:text-primary-600 hover:scale-110 transform"
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
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {t('allProducts')}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/running"
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {t('running')}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/football"
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {t('football')}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/basketball"
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {t('basketball')}
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/gym"
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {t('gymFitness')}
                </Link>
              </li>
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
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {t('contactUs')}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {tc('faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {t('shippingInfo')}
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-neutral-600 transition-colors hover:text-primary-600 font-medium"
                >
                  {tc('returns')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-outfit mb-4 font-bold text-neutral-900 uppercase tracking-wide">
              {t('newsletter')}
            </h3>
            <p className="mb-4 text-sm text-neutral-600 leading-relaxed">
              {t('newsletterText')}
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder={t('enterEmail')}
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
              <button
                type="submit"
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-700 shadow-md hover:shadow-lg"
              >
                {t('subscribe')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-600">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
