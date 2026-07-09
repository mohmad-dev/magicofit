"use client";

import { usePathname } from "next/navigation";

export default function WhatsAppFloating() {
  const pathname = usePathname();
  const isAr = pathname ? pathname.startsWith("/ar") : true;

  return (
    <a
      href="https://wa.me/201009784410"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 ${isAr ? "left-6" : "right-6"} z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 group hover:shadow-[#25D366]/40`}
      aria-label="Contact us on WhatsApp"
      id="whatsapp-floating-btn"
    >
      {/* Tooltip */}
      <span className={`absolute top-1/2 -translate-y-1/2 ${isAr ? "left-16" : "right-16"} whitespace-nowrap rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md pointer-events-none`}>
        {isAr ? "تواصل معنا عبر واتساب" : "Chat with us"}
      </span>
      {/* SVG Icon */}
      <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.45 5.416 1.451 5.48.002 9.937-4.453 9.94-9.934.002-2.654-1.03-5.15-2.906-7.03C17.165 1.751 14.673.719 12.01.719c-5.485 0-9.94 4.455-9.942 9.936-.001 1.814.479 3.593 1.39 5.163l-1.026 3.75 3.84-.1.01-.01zm11.366-7.406c-.302-.15-1.786-.882-2.062-.983-.277-.1-.478-.15-.678.15-.2.3-.777.983-.95 1.183-.175.2-.349.225-.65.075-.302-.15-1.275-.47-2.429-1.498-.898-.8-1.503-1.79-1.68-2.091-.176-.3-.02-.462.13-.611.135-.135.302-.35.453-.526.15-.175.2-.3.302-.5.1-.2.05-.375-.025-.526-.075-.15-.678-1.632-.93-2.235-.246-.588-.497-.508-.678-.518-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.801.375-.276.3-1.053 1.03-1.053 2.512s1.08 2.916 1.23 3.116c.15.2 2.124 3.243 5.146 4.545.72.31 1.28.497 1.719.637.724.23 1.38.197 1.902.12.58-.087 1.786-.73 2.037-1.435.252-.706.252-1.313.176-1.436-.075-.12-.276-.22-.577-.37z" />
      </svg>
    </a>
  );
}
