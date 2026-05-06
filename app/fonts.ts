import { Inter, Outfit, Cairo } from "next/font/google";

/**
 * Font Configuration - MagicOFit Sports E-Commerce
 * 
 * Inter: Clean, legible sans-serif for English body text and UI elements
 * Outfit: Modern, geometric display font for headings and branding
 * Cairo: Modern professional Arabic font for RTL support
 */

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
