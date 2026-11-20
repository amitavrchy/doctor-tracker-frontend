"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import { useToast } from "@/components/ui/toast";
import {
  isLoggingOut,
  setLoggingOut,
  subscribeLogout,
} from "@/lib/auth/logout-state";
import { api } from "@/lib/api/client";
import { queryKeys } from "@/lib/api/query-keys";
import type { LoginUser, User } from "@/types";

export function useMe() {
  const loggingOut = useSyncExternalStore(
    subscribeLogout,
    isLoggingOut,
    () => false,
  );
  return useQuery({
    enabled: !loggingOut,
    queryKey: queryKeys.auth.me,
    queryFn: async ({ signal }) =>
      (await api.get<User>("/auth/me", { signal })).data,
    retry: false,
  });
}

export function useLogin() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) =>
      (await api.post<LoginUser>("/auth/login", credentials)).data,
    onSuccess: () => {
      client.clear();
    },
  });
}

export function useLogout() {
  const client = useQueryClient();
  const toast = useToast();
  return useMutation({
    onMutate: async () => {
      setLoggingOut(true);
      await client.cancelQueries();
    },
    mutationFn: async () => {
      await api.post<null>("/auth/logout");
    },
    onSuccess: () => {
      client.clear();
      // A full navigation discards any remaining protected in-memory state.
      window.location.assign(new URL("/login", window.location.origin).href);
    },
    onError: () => {
      client.clear();
      setLoggingOut(false);
      toast(
        "Could not sign out. Your session may still be active; please try again.",
      );
    },
  });
}
