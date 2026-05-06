import { Container } from "@/components/layout/Container";
import CategoryShowcase from "@/components/homepage/CategoryShowcase";
import { getCategories, getProducts } from "@/lib/store-api";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Shop By Category | MagicOFit",
  description: "Browse premium athletic categories.",
};

async function getCategoryData() {
  try {
    const [categories, productsData] = await Promise.all([
      getCategories(),
      getProducts({ limit: 100 }),
    ]);

    if (categories.length === 0) return [];

    const allProducts = productsData.products;

    return categories
      .map((cat) => {
        const catProducts = allProducts.filter((p: any) =>
          p.categories?.some((c: any) => (c.id || c.category_id) === cat.id)
        );
        return {
          id: cat.id,
          name: cat.name,
          image: cat.metadata?.image as string || `https://ui-avatars.com/api/?name=${encodeURIComponent(cat.name)}&background=F97316&color=fff&size=400&bold=true`,
          productCount: catProducts.length,
          slug: cat.handle,
        };
      })
      .filter((cat) => cat.productCount > 0);
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategoryData();
  const t = await getTranslations("categoriesPage");

  return (
    <Container className="py-8 md:py-16 min-h-screen">
      <div className="mb-8 md:mb-12 border-b border-neutral-100 pb-6 md:pb-8">
        <h1 className="font-outfit text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tighter text-neutral-900 mb-3 md:mb-4">
          {t('title')}
        </h1>
        <p className="text-sm md:text-lg text-neutral-500">
          {t('subtitle')}
        </p>
      </div>

      {categories.length > 0 ? (
        <CategoryShowcase categories={categories} />
      ) : (
        <div className="text-center py-16">
          <p className="text-neutral-400 text-lg">{t('noCategories')}</p>
        </div>
      )}
    </Container>
  );
}
