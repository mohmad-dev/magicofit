export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <div className="aspect-[4/5] bg-surface-subtle rounded-lg animate-pulse" />
          <div className="pt-3 space-y-2">
            <div className="h-3 bg-surface-subtle rounded animate-pulse w-1/3" />
            <div className="h-4 bg-surface-subtle rounded animate-pulse w-4/5" />
            <div className="h-4 bg-surface-subtle rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
