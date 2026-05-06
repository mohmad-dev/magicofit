import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  state?: "default" | "error" | "success" | "disabled";
  label?: string;
  helperText?: string;
  errorText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      state = "default",
      label,
      helperText,
      errorText,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseStyles =
      "flex h-11 w-full rounded-lg border px-4 py-2 text-base transition-all duration-200 placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    const states = {
      default:
        "border-neutral-300 bg-white text-neutral-900 focus-visible:border-primary-500 focus-visible:ring-primary-500/20",
      error:
        "border-red-500 bg-white text-neutral-900 focus-visible:border-red-500 focus-visible:ring-red-500/20",
      success:
        "border-green-500 bg-white text-neutral-900 focus-visible:border-green-500 focus-visible:ring-green-500/20",
      disabled:
        "border-neutral-200 bg-neutral-100 text-neutral-500",
    };

    const stateToUse = disabled ? "disabled" : state;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-neutral-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(baseStyles, states[stateToUse], className)}
          disabled={disabled}
          aria-invalid={state === "error"}
          aria-describedby={
            helperText || errorText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        {(helperText || errorText) && (
          <p
            id={`${inputId}-helper`}
            className={cn(
              "text-xs",
              state === "error"
                ? "text-red-500"
                : "text-neutral-500"
            )}
          >
            {errorText || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
