import type { Metadata, Viewport } from "next";
import { inter, outfit, cairo } from "../fonts";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar, { CampaignAnnouncement } from "@/components/layout/AnnouncementBar";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "MagicOFit - Premium Sports E-Commerce",
  description: "Premium sports gear and equipment for athletes. Shop running shoes, training apparel, gym equipment, and more.",
  keywords: ["sports", "fitness", "running", "training", "gym", "equipment", "apparel"],
  authors: [{ name: "MagicOFit" }],
  openGraph: {
    title: "MagicOFit - Premium Sports E-Commerce",
    description: "Premium sports gear and equipment for athletes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MagicOFit - Premium Sports E-Commerce",
    description: "Premium sports gear and equipment for athletes.",
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

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const campaigns = await getActiveCampaigns();

  return (
    <html lang={locale} dir={dir} className={`${inter.variable} ${outfit.variable} ${cairo.variable} h-full antialiased`}>
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
