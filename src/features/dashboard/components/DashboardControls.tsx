"use client";
import { useState } from "react";
import { Button, Card, Input, Select } from "@/components/ui";
import { bucketCount, preset, type Granularity } from "../utils/presets";

const granularities: Granularity[] = ["day", "week", "month"];
export function DashboardControls({
  values,
  update,
  error,
}: {
  values: Record<string, string>;
  update: (v: Record<string, string | number | null>) => void;
  error?: string;
}) {
  const [from, setFrom] = useState(values.from);
  const [to, setTo] = useState(values.to);
  const [granularity, setGranularity] = useState(
    values.granularity as Granularity,
  );
  const invalidRange = !!from && !!to && from > to;
  const tooMany = (g: Granularity) => bucketCount(from, to, g) > 366;
  function changeRange(nextFrom: string, nextTo: string) {
    setFrom(nextFrom);
    setTo(nextTo);
    if (nextFrom && nextTo && nextFrom <= nextTo) {
      const finest = granularities.find((g) => {
        const count = bucketCount(nextFrom, nextTo, g);
        return count > 0 && count <= 366;
      });
      if (finest) setGranularity(finest);
    }
  }
  return (
    <Card className="mb-6 p-5">
      <div className="flex flex-wrap gap-2">
        <span className="mr-2 self-center text-sm font-semibold text-slate-600">
          Date range
        </span>
        {[
          ["Last 30 days", 0, 30],
          ["Last 3 months", 3, 0],
          ["Last 12 months", 12, 0],
        ].map(([label, months, days]) => (
          <Button
            key={label}
            size="sm"
            variant="secondary"
            onClick={() => update(preset(Number(months), Number(days)))}
          >
            {label}
          </Button>
        ))}
      </div>
      <form
        className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1.5fr_100px_auto] xl:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          if (invalidRange || tooMany(granularity)) return;
          const data = new FormData(event.currentTarget);
          update(
            Object.fromEntries(
              Array.from(data.entries()).map(([k, v]) => [k, String(v)]),
            ),
          );
        }}
      >
        <Input
          name="from"
          label="From"
          type="date"
          value={from}
          onChange={(event) => changeRange(event.target.value, to)}
          error={
            invalidRange ? "Start date must be before end date." : undefined
          }
          required
        />
        <Input
          name="to"
          label="To"
          type="date"
          value={to}
          onChange={(event) => changeRange(from, event.target.value)}
          required
        />
        <Select
          name="granularity"
          label="Granularity"
          value={granularity}
          onChange={(event) =>
            setGranularity(event.target.value as Granularity)
          }
        >
          {granularities.map((g) => (
            <option key={g} value={g} disabled={tooMany(g)}>
              {g[0].toUpperCase() + g.slice(1)}
              {tooMany(g) ? " (over 366 buckets)" : ""}
            </option>
          ))}
        </Select>
        <Input name="tz" label="Timezone" defaultValue={values.tz} required />
        <Input
          name="limit"
          label="Top N"
          type="number"
          min="1"
          max="50"
          defaultValue={values.limit}
          required
        />
        <Button type="submit" disabled={invalidRange || tooMany(granularity)}>
          Apply
        </Button>
      </form>
      {granularities.some(tooMany) && (
        <p className="mt-2 text-xs text-slate-500">
          Granularities over 366 buckets are unavailable for this range. Choose
          a shorter range if needed.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <p className="mt-3 text-xs text-slate-500">
        Trends and new patients use this range. Totals and breakdowns are
        all-time. Ranges may contain up to 366 buckets.
      </p>
    </Card>
  );
}
