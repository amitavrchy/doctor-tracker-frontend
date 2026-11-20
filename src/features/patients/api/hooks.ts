"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { api, queryString } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { Patient } from "@/types";

export type PatientInput = Pick<
  Patient,
  | "name"
  | "age"
  | "gender"
  | "phone"
  | "email"
  | "condition"
  | "admissionDate"
  | "notes"
  | "status"
>;
export function useDoctorPatients(id: string, query: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.patients.doctorList(id, query),
    queryFn: ({ signal }) =>
      api.get<Patient[]>(`/doctors/${id}/patients${queryString(query)}`, {
        signal,
      }),
    placeholderData: keepPreviousData,
    enabled: /^[a-f\d]{24}$/i.test(id),
  });
}
export function usePatientMutations(id: string) {
  const client = useQueryClient();
  const invalidate = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.patients.all }),
      client.invalidateQueries({ queryKey: queryKeys.doctors.detail(id) }),
    ]);
  };
  const add = useMutation({
    mutationFn: (input: PatientInput) =>
      api.post<Patient>(`/doctors/${id}/patients`, input),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (patientId: string) =>
      api.delete<null>(`/doctors/${id}/patients/${patientId}`),
    onSuccess: invalidate,
  });
  return { add, remove };
}
