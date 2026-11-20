import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./spinner";

export function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  className,
  children,
  ...props
}: ComponentPropsWithRef<"button"> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50",
        {
          primary: "bg-teal-700 text-white hover:bg-teal-800",
          secondary:
            "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
          ghost: "text-slate-600 hover:bg-slate-100",
          danger: "bg-red-600 text-white hover:bg-red-700",
        }[variant],
        {
          sm: "px-3 py-2 text-xs",
          md: "px-4 py-2.5 text-sm",
          lg: "px-5 py-3 text-sm",
        }[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner className="size-4" />}
      {children}
    </button>
  );
}
