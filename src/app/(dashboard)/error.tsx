"use client";

import { ErrorState } from "@/components/ui";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState message="We couldn’t load this page." onRetry={reset} />;
}
