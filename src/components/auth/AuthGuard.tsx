"use client";

import type { ReactNode } from "react";
import { useMe } from "@/hooks/use-auth";
import { ErrorState, Spinner } from "@/components/ui";

export function AuthGuard({ children }: { children: ReactNode }) {
  const me = useMe();
  if (
    me.isPending ||
    (me.isError &&
      me.error instanceof Error &&
      "status" in me.error &&
      me.error.status === 401)
  )
    return (
      <div className="flex min-h-screen items-center justify-center text-teal-700">
        <Spinner />
      </div>
    );
  if (me.isError)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorState
          message="We couldn’t verify your session. Please check your connection."
          onRetry={() => me.refetch()}
        />
      </div>
    );
  return <>{children}</>;
}
