"use client";
import { useQuery } from "@tanstack/react-query";
import { api, queryString } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { DashboardResponse } from "@/types";
export function useDashboard(query: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.dashboard(query),
    queryFn: ({ signal }) =>
      api.get<DashboardResponse>(`/dashboard${queryString(query)}`, { signal }),
  });
}
