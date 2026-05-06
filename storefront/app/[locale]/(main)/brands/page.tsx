import { Container } from "@/components/layout/Container";
import BrandLogos from "@/components/homepage/BrandLogos";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Our Brands | MagicOFit",
  description: "Explore premium athletic brands partnered with MagicOFit.",
};

export default async function BrandsPage() {
  const t = await getTranslations("brandsPage");

  return (
    <Container className="py-8 md:py-16 min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
         <h1 className="font-outfit text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tighter text-neutral-900 mb-4 md:mb-6">{t('title')}</h1>
         <p className="text-sm md:text-lg text-neutral-600">{t('subtitle')}</p>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-neutral-100">
         <BrandLogos />
      </div>
    </Container>
  );
}
