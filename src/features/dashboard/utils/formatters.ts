import type { Granularity } from "./presets";
export function formatBucket(bucket: string, granularity: Granularity) {
  const date = new Date(`${bucket}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return bucket;
  return new Intl.DateTimeFormat("en", {
    timeZone: "UTC",
    month: "short",
    ...(granularity === "month" ? { year: "numeric" } : { day: "numeric" }),
  }).format(date);
}
export function currentBucket(timeZone: string, granularity: Granularity) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  const date = new Date(Date.UTC(get("year"), get("month") - 1, get("day")));
  if (granularity === "month") date.setUTCDate(1);
  if (granularity === "week")
    date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
}
