import type { Metadata, Viewport } from "next";
import { inter, outfit, cairo } from "../fonts";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar, { CampaignAnnouncement } from "@/components/layout/AnnouncementBar";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "الماجيكو للرياضة - MagicOFit | متجر رياضي متكامل",
  description: "الماجيكو للرياضة - متجر رياضي متكامل يوفر أفضل المعدات الرياضية، أحذية الركض، الملابس التدريبية، معدات الجيم، وأكثر. تسوق الآن بأفضل الأسعار في مصر.",
  keywords: ["الماجيكو للرياضة", "MagicOFit", "متجر رياضي", "معدات رياضية", "أحذية ركض", "ملابس رياضية", "معدات جيم", "تدريب", "لياقة بدنية", "رياضة", "كرة قدم", "كرة سلة", "أحذية رياضية", "مصر", "EGP"],
  authors: [{ name: "Mohamed Ahmed Marei" }],
  icons: {
    icon: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "الماجيكو للرياضة - MagicOFit | متجر رياضي متكامل",
    description: "متجر رياضي متكامل يوفر أفضل المعدات الرياضية، أحذية الركض، الملابس التدريبية، معدات الجيم، وأكثر.",
    type: "website",
    locale: "ar_EG",
    siteName: "الماجيكو للرياضة",
  },
  twitter: {
    card: "summary_large_image",
    title: "الماجيكو للرياضة - MagicOFit | متجر رياضي متكامل",
    description: "متجر رياضي متكامل يوفر أفضل المعدات الرياضية، أحذية الركض، الملابس التدريبية، معدات الجيم، وأكثر.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

async function getActiveCampaigns(): Promise<CampaignAnnouncement[]> {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return [];
  }
  try {
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const authRes = await fetch(`${backendUrl}/auth/user/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.MEDUSA_ADMIN_EMAIL || "admin@magicofit.com",
        password: process.env.MEDUSA_ADMIN_PASSWORD || "admin123",
      }),
      cache: "no-store",
    });
    if (!authRes.ok) return [];
    const { token } = await authRes.json();

    const res = await fetch(`${backendUrl}/admin/campaigns?limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const campaigns = data.campaigns || [];

    // Filter to only active campaigns (starts_at in past, ends_at in future)
    return campaigns
      .filter((c: any) => {
        const started = !c.starts_at || new Date(c.starts_at) <= new Date();
        const notEnded = !c.ends_at || new Date(c.ends_at) >= new Date();
        return started && notEnded;
      })
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
      }));
  } catch {
    return [];
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const campaigns = await getActiveCampaigns();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsGoodsStore',
    name: 'الماجيكو للرياضة - MagicOFit',
    alternateName: 'MagicOFit',
    description: 'متجر رياضي متكامل يوفر أفضل المعدات الرياضية، أحذية الركض، الملابس التدريبية، معدات الجيم، وأكثر.',
    url: 'https://magicofit.shop',
    telephone: '+201091998631',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
    },
    sameAs: [
      'https://www.facebook.com/share/18hLJiTUda/',
      'https://www.tiktok.com/@almageko58',
    ],
  };

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${outfit.variable} ${cairo.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body className={`min-h-full flex flex-col font-sans`}>
        <NextIntlClientProvider messages={messages}>
          <div className="flex min-h-screen flex-col">
            <AnnouncementBar
              campaigns={campaigns}
            />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
