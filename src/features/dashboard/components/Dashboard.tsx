"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, ErrorState } from "@/components/ui";
import { ListLoading } from "@/features/shared/ListLoading";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { ApiError } from "@/lib/api/client";
import type { DashboardResponse } from "@/types";
import { serverErrors } from "@/features/shared/validation";
import { useDashboard } from "../api/hooks";
import { preset } from "../utils/presets";
import { DashboardControls } from "./DashboardControls";
import { KpiCards } from "./KpiCards";
const Charts = dynamic(
  () => import("./DashboardCharts").then((module) => module.DashboardCharts),
  { ssr: false, loading: () => <ListLoading /> },
);
const subscribe = () => () => {};
export function Dashboard() {
  const params = useSearchParams();
  const update = useUpdateSearchParams();
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const defaults = preset(12);
  const values = {
    from: params.get("from") || defaults.from,
    to: params.get("to") || defaults.to,
    granularity: params.get("granularity") || "month",
    tz:
      params.get("tz") ||
      (ready
        ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        : "UTC"),
    limit: params.get("limit") || "10",
  };
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A clear view of your care network and its activity."
      />
      {ready ? (
        <DashboardContent values={values} update={update} />
      ) : (
        <ListLoading />
      )}
    </>
  );
}
function DashboardContent({
  values,
  update,
}: {
  values: Record<string, string>;
  update: (v: Record<string, string | number | null>) => void;
}) {
  const query = useDashboard(values);
  const [lastGood, setLastGood] = useState<DashboardResponse | null>(null);
  if (query.data && query.data.data !== lastGood) setLastGood(query.data.data);
  const data = query.data?.data || lastGood;
  const validationError =
    query.error instanceof ApiError && query.error.status === 400;
  const error = query.error
    ? serverErrors(query.error, ["from", "to", "tz", "limit", "granularity"])
    : null;
  return (
    <>
      <DashboardControls
        key={JSON.stringify(values)}
        values={values}
        update={update}
        error={
          validationError
            ? [error?.message, ...Object.values(error?.errors || {})]
                .filter(Boolean)
                .join(" ")
            : undefined
        }
      />
      {query.isPending && !data ? (
        <ListLoading />
      ) : query.isError && !validationError && !data ? (
        <Card>
          <ErrorState
            message={[error?.message, ...Object.values(error?.errors || {})]
              .filter(Boolean)
              .join(" ")}
            onRetry={() => query.refetch()}
          />
        </Card>
      ) : data ? (
        <>
          {query.isPending && (
            <p role="status" className="mb-4 text-sm text-slate-500">
              Updating dashboard; showing the previous results.
            </p>
          )}
          {validationError && (
            <p className="mb-4 text-sm text-slate-500">
              Showing the previous results for the last valid range.
            </p>
          )}
          {query.isError && !validationError && (
            <Card>
              <ErrorState
                message={query.error.message}
                onRetry={() => query.refetch()}
              />
            </Card>
          )}
          <KpiCards totals={data.totals} />
          <Charts data={data} />
        </>
      ) : null}
    </>
  );
}
