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

    const categoryData = categories.map((cat) => {
      const catProducts = allProducts.filter((p: any) =>
        p.categories?.some((c: any) => (c.id || c.category_id) === cat.id)
      );
      return {
        id: cat.id,
        name: cat.name,
        image: (cat.metadata?.image as string) || "",
        productCount: catProducts.length,
        slug: cat.handle,
      };
    });

    // Show all categories, even if they have 0 products
    return categoryData;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategoryData();
  const t = await getTranslations("categoriesPage");

  return (
    <Container className="py-6 md:py-8 min-h-screen">
      <div className="mb-6 md:mb-8 border-b border-border-subtle pb-4 md:pb-6">
        <h1 className="font-display text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase rtl:tracking-normal tracking-tight text-ink-primary mb-3 md:mb-4">
          {t('title')}
        </h1>
        <p className="text-sm md:text-lg text-ink-secondary">
          {t('subtitle')}
        </p>
      </div>

      {categories.length > 0 ? (
        <CategoryShowcase categories={categories} />
      ) : (
        <div className="text-center py-16">
          <p className="text-ink-secondary text-lg">{t('noCategories')}</p>
        </div>
      )}
    </Container>
  );
}
