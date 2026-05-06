import { Meilisearch } from 'meilisearch';

export const searchClient = new Meilisearch({
  host: process.env.NEXT_PUBLIC_MEILI_URL || 'http://127.0.0.1:7700',
  apiKey: process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY || 'masterKey123',
});

export const productsIndex = searchClient.index('products');

export interface SearchFilters {
  categories?: string[];
  brands?: string[];
  sizes?: string[];
  colors?: string[];
  priceRange?: { min: number; max: number };
  sport?: string;
  gender?: string;
  inStockOnly?: boolean;
  onSale?: boolean;
  minRating?: number;
}

export interface SearchParams {
  query?: string;
  filters?: SearchFilters;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function searchProducts(params: SearchParams) {
  const { query, filters = {}, sort = 'best-selling', page = 1, limit = 20 } = params;

  const filterParts: string[] = [];

  if (filters.categories?.length) {
    filterParts.push(`category_handle IN [${filters.categories.map(c => `"${c}"`).join(', ')}]`);
  }
  if (filters.brands?.length) {
    filterParts.push(`brand IN [${filters.brands.map(b => `"${b}"`).join(', ')}]`);
  }
  if (filters.sizes?.length) {
    filterParts.push(`sizes IN [${filters.sizes.map(s => `"${s}"`).join(', ')}]`);
  }
  if (filters.colors?.length) {
    filterParts.push(`colors IN [${filters.colors.map(c => `"${c}"`).join(', ')}]`);
  }
  if (filters.priceRange) {
    filterParts.push(`price_usd >= ${filters.priceRange.min} AND price_usd <= ${filters.priceRange.max}`);
  }
  if (filters.sport) {
    filterParts.push(`sport = "${filters.sport}"`);
  }
  if (filters.gender) {
    filterParts.push(`gender = "${filters.gender}"`);
  }
  if (filters.inStockOnly) {
    filterParts.push(`in_stock = true`);
  }
  if (filters.onSale) {
    filterParts.push(`on_sale = true`);
  }
  if (filters.minRating) {
    filterParts.push(`rating >= ${filters.minRating}`);
  }

  const sortMap: Record<string, string[]> = {
    "best-selling":  ["total_sold:desc"],
    "price-asc":     ["price_usd:asc"],
    "price-desc":    ["price_usd:desc"],
    "newest":        ["created_at_timestamp:desc"],
    "rating":        ["rating:desc"],
  };

  try {
    const response = await productsIndex.search(query || "", {
      filter: filterParts.join(" AND "),
      sort: sortMap[sort] || ["total_sold:desc"],
      facets: [
        "category_handle",
        "brand",
        "sport",
        "gender",
        "sizes",
        "colors",
        "on_sale",
        "in_stock",
      ],
      hitsPerPage: limit,
      page: page,
    });

    return {
      products: response.hits,
      totalProducts: response.totalHits,
      totalPages: response.totalPages,
      currentPage: response.page,
      facets: response.facetDistribution,
      processingTimeMs: response.processingTimeMs,
    };
  } catch (error) {
    console.error('Meilisearch Error:', error);
    return {
      products: [],
      totalProducts: 0,
      totalPages: 0,
      currentPage: 1,
      facets: {},
    };
  }
}
