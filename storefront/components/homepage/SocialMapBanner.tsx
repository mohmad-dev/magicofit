"use client";

import { useLocale } from "next-intl";
import { MapPin } from "lucide-react";

export default function SocialMapBanner() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section className="py-10 md:py-12 bg-white border-t border-[#EAEAEA] text-[#111318]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Contact Column */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#111318] rtl:tracking-normal tracking-tight">
              {isAr ? "زورنا أو تواصل معنا" : "Visit Us or Get in Touch"}
            </h2>
            <p className="text-[#525252] text-sm md:text-base leading-relaxed">
              {isAr
                ? "بني سويف، بجوار قاعة القصر — تواصل معنا مباشرة للطلبات والاستفسارات."
                : "Beni Suef, Next to Palace Hall — visit our store or reach out directly."}
            </p>

            {/* Inline Social Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://wa.me/201009784410"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 rounded-full bg-[#0F1115] hover:bg-[#1E9E52] text-white text-sm font-bold inline-flex items-center gap-2.5 transition-colors"
              >
                <svg className="h-4 w-4 fill-current text-[#25D366]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.45 5.416 1.451 5.48.002 9.937-4.453 9.94-9.934.002-2.654-1.03-5.15-2.906-7.03C17.165 1.751 14.673.719 12.01.719c-5.485 0-9.94 4.455-9.942 9.936-.001 1.814.479 3.593 1.39 5.163l-1.026 3.75 3.84-.1.01-.01zm11.366-7.406c-.302-.15-1.786-.882-2.062-.983-.277-.1-.478-.15-.678.15-.2.3-.777.983-.95 1.183-.175.2-.349.225-.65.075-.302-.15-1.275-.47-2.429-1.498-.898-.8-1.503-1.79-1.68-2.091-.176-.3-.02-.462.13-.611.135-.135.302-.35.453-.526.15-.175.2-.3.302-.5.1-.2.05-.375-.025-.526-.075-.15-.678-1.632-.93-2.235-.246-.588-.497-.508-.678-.518-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.801.375-.276.3-1.053 1.03-1.053 2.512s1.08 2.916 1.23 3.116c.15.2 2.124 3.243 5.146 4.545.72.31 1.28.497 1.719.637.724.23 1.38.197 1.902.12.58-.087 1.786-.73 2.037-1.435.252-.706.252-1.313.176-1.436-.075-.12-.276-.22-.577-.37z" />
                </svg>
                <span>{isAr ? "واتساب" : "WhatsApp"}</span>
                <span dir="ltr" className="font-latin text-xs font-semibold opacity-90">
                  +20 100 978 4410
                </span>
              </a>

              <a
                href="https://www.tiktok.com/@almageko58?_r=1&_t=ZS-97tHN5U77An"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] px-5 rounded-full bg-[#F5F5F5] hover:bg-[#0F1115] text-[#111318] hover:text-white border border-[#EAEAEA] text-sm font-bold inline-flex items-center gap-2.5 transition-colors"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.84a8.28 8.28 0 004.76 1.5V6.89a4.85 4.85 0 01-1-.2z" />
                </svg>
                <span dir="ltr" className="font-latin">@almageko58</span>
              </a>
            </div>

            <div className="pt-1">
              <a
                href="https://maps.app.goo.gl/3we1kunJJPAt1qC99?g_st=ac"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#525252] hover:text-[#111318] transition-colors"
              >
                <MapPin className="h-4 w-4 text-[#D9480F]" aria-hidden="true" />
                <span>{isAr ? "فتح الموقع في خرائط جوجل" : "Open in Google Maps"}</span>
              </a>
            </div>
          </div>

          {/* Uncluttered Map Column */}
          <div className="lg:col-span-7 w-full h-[220px] sm:h-[250px] rounded-2xl overflow-hidden border border-[#EAEAEA] bg-[#F5F5F5]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5191.63793802055!2d31.09199851054208!3d29.06332707416061!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145a256b7ba7aec9%3A0xdd9aca452656a176!2z2YXYrdmEINin2YTZhdin2KzZitmD2Ygg2YTZhNix2YrYp9i22Yc!5e0!3m2!1sar!2seg!4v1783606844512!5m2!1sar!2seg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
