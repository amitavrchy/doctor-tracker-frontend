"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api, queryString } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { Doctor } from "@/types";

export type DoctorInput = Pick<
  Doctor,
  "name" | "specialization" | "hospital" | "phone" | "email"
>;
export function useDoctors(query: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.doctors.list(query),
    queryFn: ({ signal }) =>
      api.get<Doctor[]>(`/doctors${queryString(query)}`, { signal }),
    placeholderData: keepPreviousData,
  });
}
export function useDoctor(id: string) {
  return useQuery({
    queryKey: queryKeys.doctors.detail(id),
    queryFn: ({ signal }) => api.get<Doctor>(`/doctors/${id}`, { signal }),
    enabled: /^[a-f\d]{24}$/i.test(id),
  });
}
export function useCreateDoctor() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: DoctorInput) => api.post<Doctor>("/doctors", input),
    onSuccess: () =>
      client.invalidateQueries({ queryKey: ["doctors", "list"] }),
  });
}
