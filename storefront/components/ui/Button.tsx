import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "icon";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-lg font-semibold cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      primary:
        "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-600 shadow-sm hover:shadow-md active:scale-[0.98]",
      secondary:
        "bg-obsidian-900 text-white hover:bg-obsidian-800 focus-visible:ring-obsidian-900 shadow-sm active:scale-[0.98]",
      outline:
        "border border-border-subtle bg-white text-ink-primary hover:border-ink-primary hover:bg-surface-subtle focus-visible:ring-primary-600 active:scale-[0.98]",
      ghost:
        "bg-transparent text-ink-primary hover:bg-surface-subtle focus-visible:ring-neutral-400 active:scale-[0.98]",
      destructive:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 shadow-sm active:scale-[0.98]",

      icon:
        "bg-transparent text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-500 p-2",
    };

    const sizes = {
      sm: "min-h-[38px] px-3.5 text-xs sm:text-sm",
      md: "min-h-[44px] px-5 text-sm sm:text-base",
      lg: "min-h-[52px] px-8 text-base sm:text-lg",
      icon: "h-11 w-11 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loading && "cursor-not-allowed opacity-70",
          className
        )}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
