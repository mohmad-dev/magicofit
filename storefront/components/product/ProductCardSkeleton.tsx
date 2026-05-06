import { Skeleton } from "../ui/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <div className="border border-neutral-200 rounded-2xl overflow-hidden bg-white">
      {/* Image */}
      <div className="aspect-[3/4] bg-neutral-100">
        <Skeleton variant="product" className="h-full w-full" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Title */}
        <Skeleton variant="text" className="h-6 w-3/4" />

        {/* Price */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col gap-1">
            <Skeleton variant="text" className="h-6 w-16" />
            <Skeleton variant="text" className="h-4 w-12" />
          </div>
          
          {/* Add to cart button */}
          <Skeleton variant="avatar" className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}
