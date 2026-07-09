"use client";

import { usePathname } from "next/navigation";

export default function SocialMapBanner() {
  const pathname = usePathname();
  const isAr = pathname ? pathname.startsWith("/ar") : true;

  return (
    <section className="py-12 md:py-16 bg-neutral-900 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-accent-600/10" />
      
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-10">
          
          {/* Social Media Column */}
          <div className="flex flex-col space-y-6 text-center lg:text-right" dir={isAr ? "rtl" : "ltr"}>
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-500/10 text-primary-400 border border-primary-500/20">
                {isAr ? "تواصل معنا" : "Contact Us"}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {isAr ? "تابع عروضنا الحصرية وكن على تواصل دائم" : "Follow Our Exclusive Offers & Stay Tuned"}
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
                {isAr
                  ? "تواصل مع صاحب المتجر مباشرة للاستفسارات السريعة، أو تابعنا على منصة تيك توك لمشاهدة أقوى الفيديوهات والعروض الرياضية الحصرية!"
                  : "Get in touch directly with the store owner for quick inquiries, or follow us on TikTok to watch the latest sports reels and exclusive deals!"}
              </p>
            </div>

            {/* Social Links Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* WhatsApp Card */}
              <a
                href="https://wa.me/201009784410"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#25D366]/30 p-4 rounded-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366] transition-transform duration-300 group-hover:scale-110">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.45 5.416 1.451 5.48.002 9.937-4.453 9.94-9.934.002-2.654-1.03-5.15-2.906-7.03C17.165 1.751 14.673.719 12.01.719c-5.485 0-9.94 4.455-9.942 9.936-.001 1.814.479 3.593 1.39 5.163l-1.026 3.75 3.84-.1.01-.01zm11.366-7.406c-.302-.15-1.786-.882-2.062-.983-.277-.1-.478-.15-.678.15-.2.3-.777.983-.95 1.183-.175.2-.349.225-.65.075-.302-.15-1.275-.47-2.429-1.498-.898-.8-1.503-1.79-1.68-2.091-.176-.3-.02-.462.13-.611.135-.135.302-.35.453-.526.15-.175.2-.3.302-.5.1-.2.05-.375-.025-.526-.075-.15-.678-1.632-.93-2.235-.246-.588-.497-.508-.678-.518-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.801.375-.276.3-1.053 1.03-1.053 2.512s1.08 2.916 1.23 3.116c.15.2 2.124 3.243 5.146 4.545.72.31 1.28.497 1.719.637.724.23 1.38.197 1.902.12.58-.087 1.786-.73 2.037-1.435.252-.706.252-1.313.176-1.436-.075-.12-.276-.22-.577-.37z" />
                  </svg>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-white text-sm">
                    {isAr ? "واتساب المبيعات" : "Sales WhatsApp"}
                  </h3>
                  <p className="text-xs text-[#25D366] font-semibold tracking-wider" dir="ltr">
                    +20 100 978 4410
                  </p>
                </div>
              </a>

              {/* TikTok Card */}
              <a
                href="https://www.tiktok.com/@almageko58?_r=1&_t=ZS-97tHN5U77An"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-neutral-400/30 p-4 rounded-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-white transition-transform duration-300 group-hover:scale-110">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.84a8.28 8.28 0 004.76 1.5V6.89a4.85 4.85 0 01-1-.2z" />
                  </svg>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-white text-sm">
                    {isAr ? "حساب التيك توك" : "TikTok Channel"}
                  </h3>
                  <p className="text-xs text-neutral-400 font-semibold">
                    @almageko58
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Map Column */}
          <div className="relative w-full aspect-video md:h-[280px] bg-neutral-800 rounded-xl overflow-hidden shadow-lg border border-white/10">
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
            {/* Map overlay flag */}
            <div className={`absolute bottom-3 ${isAr ? "right-3" : "left-3"} bg-neutral-900/90 backdrop-blur-sm border border-white/10 rounded-lg px-3.5 py-1.5 text-xs text-white font-semibold flex items-center gap-1.5 shadow-md`}>
              <svg className="h-4 w-4 text-primary-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {isAr ? "مقر المتجر - بني سويف" : "Shop Headquarters - Beni Suef"}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
