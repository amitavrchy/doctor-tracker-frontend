import { Card } from "@/components/ui";
export function ChartCard({
  title,
  description,
  children,
  empty,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  empty: boolean;
}) {
  return (
    <Card className="min-w-0 p-5">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
      {empty ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">
          No data to display yet.
        </div>
      ) : (
        <div
          role="group"
          aria-label={`${title}. ${description || "See the data summary below."}`}
          className="mt-4"
        >
          {children}
        </div>
      )}
    </Card>
  );
}
