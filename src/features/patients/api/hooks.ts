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
      client.invalidateQueries({ queryKey: ["doctors", "list"] }),
      client.invalidateQueries({ queryKey: queryKeys.doctors.detail(id) }),
      client.invalidateQueries({ queryKey: ["dashboard"] }),
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

export function usePatients(query: Record<string, string>) {
  return useQuery({
    queryKey: queryKeys.patients.list(query),
    queryFn: ({ signal }) =>
      api.get<Patient[]>(`/patients${queryString(query)}`, { signal }),
    placeholderData: keepPreviousData,
  });
}
export function usePatient(id: string | null) {
  return useQuery({
    queryKey: queryKeys.patients.detail(id || ""),
    queryFn: ({ signal }) => api.get<Patient>(`/patients/${id}`, { signal }),
    enabled: !!id,
  });
}
export function useGlobalPatientMutations() {
  const client = useQueryClient();
  const invalidate = async (doctorIds: string[]) => {
    await Promise.all([
      client.invalidateQueries({ queryKey: queryKeys.patients.all }),
      client.invalidateQueries({ queryKey: ["doctors", "list"] }),
      client.invalidateQueries({ queryKey: ["dashboard"] }),
      ...doctorIds
        .filter(Boolean)
        .map((id) =>
          client.invalidateQueries({ queryKey: queryKeys.doctors.detail(id) }),
        ),
    ]);
  };
  const edit = useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Partial<PatientInput> & { doctor?: string };
      doctorIds: string[];
    }) => api.patch<Patient>(`/patients/${id}`, input),
    onSuccess: (_data, variables) => invalidate(variables.doctorIds),
  });
  const remove = useMutation({
    mutationFn: ({ id }: { id: string; doctorIds: string[] }) =>
      api.delete<null>(`/patients/${id}`),
    onSuccess: (_data, variables) => invalidate(variables.doctorIds),
  });
  return { edit, remove };
}
