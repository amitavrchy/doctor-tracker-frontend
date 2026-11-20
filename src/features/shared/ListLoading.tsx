import { Card, Skeleton } from "@/components/ui";

export function ListLoading() {
  return (
    <Card className="space-y-4 p-6">
      <span className="sr-only">Loading records</span>
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </Card>
  );
}
