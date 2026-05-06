import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  // A generic skeleton loader for the main application pages
  return (
    <div className="flex flex-col gap-8 w-full max-w-screen-2xl mx-auto px-4 lg:px-8 py-8 pointer-events-none">
      {/* Hero Skeleton */}
      <Skeleton className="w-full h-[60vh] rounded-3xl" />
      
      {/* Categories Skeleton */}
      <div className="space-y-4 pt-10">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={`cat-${i}`} className="w-full aspect-[4/5] rounded-xl" />
          ))}
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="space-y-4 pt-10">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={`prod-${i}`} className="flex flex-col gap-2">
              <Skeleton className="w-full aspect-square rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
