"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

const common = ["q", "from", "to", "sortBy", "order", "page", "limit"];
export function useListState(extra: string[]) {
  const params = useSearchParams();
  const update = useUpdateSearchParams();
  const values: Record<string, string> = {};
  for (const key of [...common, ...extra]) {
    const value = params.get(key);
    if (value) values[key] = value;
  }
  const clear = useCallback(() => {
    const updates: Record<string, null> = {};
    for (const key of [...common, ...extra]) updates[key] = null;
    update(updates);
  }, [update, extra]);
  const count = ["q", "from", "to", ...extra].filter(
    (key) => values[key],
  ).length;
  return { values, update, clear, count };
}
