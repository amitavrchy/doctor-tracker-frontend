import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800",
        className,
      )}
    >
      {children}
    </span>
  );
}
