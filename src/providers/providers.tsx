"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { ApiError } from "@/lib/api/client";
import { isLoggingOut } from "@/lib/auth/logout-state";
import { ToastProvider } from "@/components/ui";

function SessionListener({ client }: { client: QueryClient }) {
  useEffect(() => {
    let redirecting = false;
    const expired = () => {
      if (redirecting || isLoggingOut()) return;
      redirecting = true;
      client.clear();
      const next = window.location.pathname + window.location.search;
      // Reload to discard all protected in-memory state after expiry.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(
        `/login?expired=1&next=${encodeURIComponent(next)}`,
      );
    };
    window.addEventListener("auth:expired", expired);
    return () => window.removeEventListener("auth:expired", expired);
  }, [client]);
  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: (count, error) =>
              !(
                error instanceof ApiError &&
                error.status >= 400 &&
                error.status < 500
              ) && count < 2,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      <ToastProvider>
        <SessionListener client={client} />
        {children}
      </ToastProvider>
    </QueryClientProvider>
  );
}
