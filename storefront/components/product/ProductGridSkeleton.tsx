export default function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
          <div className="relative aspect-square bg-neutral-100 mx-2 mt-2 rounded-xl">
            <div className="absolute inset-0 animate-pulse bg-neutral-200 rounded-xl" />
          </div>
          <div className="p-3 flex flex-col gap-1">
            <div className="h-3 bg-neutral-200 rounded animate-pulse w-3/4" />
            <div className="flex items-center justify-between mt-1">
              <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/3" />
              <div className="h-7 w-12 bg-neutral-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
