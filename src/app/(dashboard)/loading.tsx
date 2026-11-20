import { Skeleton } from "@/components/ui";

export default function Loading() {
  return (
    <div aria-label="Loading page" className="space-y-5">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-5 w-72" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
