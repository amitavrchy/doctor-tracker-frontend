"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const pages = [...new Set([1, page - 1, page, page + 1, totalPages])]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <span className="text-sm text-slate-500">
        {total} total · Page {page} of {Math.max(1, totalPages)}
      </span>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </Button>
        {pages.map((n, i) => (
          <span key={n} className="flex items-center">
            {i > 0 && n - pages[i - 1] > 1 && <span className="px-1">…</span>}
            <Button
              variant={n === page ? "primary" : "ghost"}
              size="sm"
              aria-current={n === page ? "page" : undefined}
              onClick={() => onPageChange(n)}
            >
              {n}
            </Button>
          </span>
        ))}
        <Button
          variant="ghost"
          size="sm"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </nav>
  );
}
