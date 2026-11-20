"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      title="Something went wrong"
      description={message}
      icon={<AlertCircle />}
      action={
        onRetry && (
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    />
  );
}
