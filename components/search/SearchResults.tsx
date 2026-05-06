import ProductCard from "../product/ProductCard";

interface SearchResult {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock?: boolean;
  stock?: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  totalResults: number;
  loading?: boolean;
}

export default function SearchResults({
  results,
  query,
  totalResults,
  loading = false,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-2">No results found</p>
        <p className="text-gray-400 text-sm">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  if (results.length === 0 && !query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-2">Start searching</p>
        <p className="text-gray-400 text-sm">
          Enter a keyword to find products
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {totalResults} result{totalResults !== 1 ? "s" : ""} for "{query}"
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {results.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
          />
        ))}
      </div>
    </div>
  );
}
