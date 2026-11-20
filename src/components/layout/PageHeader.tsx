import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {breadcrumbs && (
          <div className="mb-3 text-sm text-slate-500">{breadcrumbs}</div>
        )}
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">
          Care workspace
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        )}
      </div>
      {actions}
    </header>
  );
}
