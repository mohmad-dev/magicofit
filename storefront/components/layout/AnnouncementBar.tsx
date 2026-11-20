"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

export interface CampaignAnnouncement {
  id: string;
  name: string;
  description?: string;
}

interface AnnouncementBarProps {
  campaigns: CampaignAnnouncement[];
  locale?: string;
}

export default function AnnouncementBar({
  campaigns,
  locale,
}: AnnouncementBarProps) {
  const pathname = usePathname();
  const resolvedLocale = locale || (pathname?.startsWith("/en") ? "en" : "ar");
  const isAr = resolvedLocale === "ar";
  const [isVisible, setIsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem("announcement-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const oneDay = 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedTime < oneDay) {
        setIsVisible(false);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("announcement-dismissed", Date.now().toString());
  };

  const fallbackMessage = isAr
    ? "شحن مجاني للطلبات فوق 2,000 ج.م. • الدفع عند الاستلام لجميع محافظات مصر"
    : "Free shipping on orders over 2,000 EGP • Cash on delivery across Egypt";

  const campaignMessages = campaigns.map((c) => {
    if (c.name === "خصم 15% لأول مرة لتسجيل واتساب") {
      return "خصم 20% لفترة محدودة على أول طلب";
    }
    return c.name;
  });

  const messages = campaignMessages.length > 0 ? campaignMessages : [fallbackMessage];

  if (!isVisible) return null;

  return (
    <div className="bg-[#181B20] text-neutral-200 border-b border-white/10 relative">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-2">
        {messages.length === 1 ? (
          <div className="flex items-center justify-center gap-2.5 text-xs sm:text-[13px] pe-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" aria-hidden="true" />
            <p className="text-center font-medium">{messages[0]}</p>
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute end-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label={isAr ? "إغلاق الإعلان" : "Dismiss announcement"}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="relative flex items-center pe-10">
            <div className="relative flex-1 overflow-hidden" dir="ltr">
              <div
                className={`flex items-center ${mounted ? "animate-brand-marquee" : ""}`}
                style={{ width: "max-content" }}
              >
                {messages.map((msg, i) => (
                  <span
                    key={i}
                    dir={isAr ? "rtl" : "ltr"}
                    className="inline-flex items-center gap-2.5 whitespace-nowrap text-xs sm:text-[13px] font-medium px-6"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
                    {msg}
                  </span>
                ))}
                {messages.map((msg, i) => (
                  <span
                    key={`dup-${i}`}
                    dir={isAr ? "rtl" : "ltr"}
                    className="inline-flex items-center gap-2.5 whitespace-nowrap text-xs sm:text-[13px] font-medium px-6"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" aria-hidden="true" />
                    {msg}
                  </span>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#181B20] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#181B20] to-transparent" />
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute end-0 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors z-10 cursor-pointer"
              aria-label={isAr ? "إغلاق الإعلان" : "Dismiss announcement"}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
