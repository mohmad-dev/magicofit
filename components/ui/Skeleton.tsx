import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "avatar" | "product";
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", ...props }, ref) => {
    const baseStyles = "animate-pulse rounded-md bg-[var(--color-neutral-200)]";

    const variants = {
      text: "h-4 w-full",
      card: "h-48 w-full",
      avatar: "h-10 w-10 rounded-full",
      product: "aspect-square w-full",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
