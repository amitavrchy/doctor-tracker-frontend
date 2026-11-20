"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button, Card, Input, Select } from "@/components/ui";

export type FilterOption = { value: string; label: string };
export type Filter = {
  name: string;
  label: string;
  options?: FilterOption[];
  type?: string;
  maxLength?: number;
};
export type ListFilterProps = {
  values: Record<string, string>;
  count: number;
  onUpdate: (updates: Record<string, string | number | null>) => void;
  onClear: () => void;
};

function Search({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => {
    if (draft === value) return;
    const timer = window.setTimeout(() => onChange(draft.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [draft, value, onChange]);
  return (
    <Input
      label="Search"
      placeholder="Name or contact details"
      value={draft}
      maxLength={100}
      onChange={(event) => setDraft(event.target.value)}
    />
  );
}

export function ListFilters({
  values,
  filters,
  sortOptions,
  count,
  onUpdate,
  onClear,
  children,
  patientLayout = false,
}: ListFilterProps & {
  filters: Filter[];
  sortOptions: FilterOption[];
  children?: React.ReactNode;
  patientLayout?: boolean;
}) {
  const [searchVersion, setSearchVersion] = useState(0);
  const [dateError, setDateError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updates: Record<string, string | number | null> = { page: 1 };
    for (const filter of filters)
      updates[filter.name] = String(data.get(filter.name) || "").trim();
    const from = String(updates.from || ""),
      to = String(updates.to || "");
    if (from && to && from > to) {
      setDateError(true);
      return;
    }
    setDateError(false);
    onUpdate(updates);
  }
  const active = filters.filter((filter) => values[filter.name]);
  const renderFilter = (filter: Filter) =>
    filter.options ? (
      <Select
        key={filter.name}
        name={filter.name}
        label={filter.label}
        defaultValue={values[filter.name] || ""}
      >
        <option value="">All</option>
        {filter.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    ) : (
      <Input
        key={filter.name}
        name={filter.name}
        label={filter.label}
        type={filter.type || "text"}
        maxLength={filter.maxLength || 200}
        defaultValue={values[filter.name] || ""}
        placeholder={filter.type ? undefined : "Exact match"}
      />
    );
  return (
    <Card className="mb-5 p-4 sm:p-5">
      <div
        className={`grid gap-3 lg:items-end ${patientLayout ? (children ? "lg:grid-cols-5" : "lg:grid-cols-4") : "lg:grid-cols-6"}`}
      >
        <div className="flex items-end gap-2 lg:contents">
          <div className="min-w-0 flex-1">
            <Search
              key={`${values.q || ""}-${searchVersion}`}
              value={values.q || ""}
              onChange={(q) => onUpdate({ q, page: 1 })}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="min-h-11 shrink-0 lg:hidden"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => setExpanded(!expanded)}
          >
            <SlidersHorizontal size={16} /> Filters{" "}
            {count > 0 && (
              <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-800">
                {count}
              </span>
            )}
          </Button>
        </div>
        <form
          id={panelId}
          key={filters.map((filter) => values[filter.name] || "").join("|")}
          onSubmit={submit}
          className={`${expanded ? "block" : "hidden"} lg:contents`}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:contents">
            {children}
            {filters
              .filter((filter) => !patientLayout || filter.type !== "date")
              .map(renderFilter)}
          </div>
          <div
            className={`mt-3 grid gap-3 sm:grid-cols-3 lg:col-span-full lg:mt-0 lg:items-end ${patientLayout ? "lg:grid-cols-[repeat(5,minmax(0,1fr))_auto]" : "lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]"}`}
          >
            {patientLayout &&
              filters
                .filter((filter) => filter.type === "date")
                .map(renderFilter)}
            <Select
              label="Sort by"
              value={values.sortBy || "createdAt"}
              onChange={(event) =>
                onUpdate({ sortBy: event.target.value, page: 1 })
              }
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              label="Order"
              value={values.order || "desc"}
              onChange={(event) =>
                onUpdate({ order: event.target.value, page: 1 })
              }
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </Select>
            <Select
              label="Per page"
              value={values.limit || "20"}
              onChange={(event) =>
                onUpdate({ limit: event.target.value, page: 1 })
              }
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
            <div className="flex flex-wrap gap-2 sm:col-span-3 lg:col-span-1 lg:justify-end">
              <Button type="submit" variant="secondary">
                Apply filters
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={(event) => {
                  event.currentTarget.form?.reset();
                  setDateError(false);
                  setSearchVersion((v) => v + 1);
                  onClear();
                }}
              >
                Clear filters
              </Button>
            </div>
          </div>
          {(dateError ||
            (values.from && values.to && values.from > values.to)) && (
            <p
              role="alert"
              className="mt-2 text-sm text-red-600 lg:col-span-full"
            >
              Start date must be before end date.
            </p>
          )}
        </form>
      </div>
      {active.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Active filters">
          {active.map((filter) => (
            <button
              key={filter.name}
              type="button"
              onClick={() => {
                setDateError(false);
                onUpdate({ [filter.name]: null, page: 1 });
              }}
              aria-label={`Remove ${filter.label} filter`}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              <span className="truncate">
                {filter.label}:{" "}
                {filter.options?.find(
                  (option) => option.value === values[filter.name],
                )?.label || values[filter.name]}
              </span>
              <X size={13} className="shrink-0" />
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
