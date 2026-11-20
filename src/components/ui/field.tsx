import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type Field = { label: string; hint?: string; error?: string };

export const fieldClass =
  "block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10";

export function FieldFrame({
  label,
  hint,
  error,
  id,
  children,
}: Field & { id: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      {children}
      {(error || hint) && (
        <p
          id={`${id}-description`}
          className={cn("text-xs", error ? "text-red-600" : "text-slate-500")}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
