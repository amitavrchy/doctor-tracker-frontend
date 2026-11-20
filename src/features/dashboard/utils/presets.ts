export type Granularity = "day" | "week" | "month";

export function bucketCount(
  from: string,
  to: string,
  granularity: Granularity,
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(from) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(to) ||
    from > to
  )
    return 0;
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  if (granularity === "month")
    return (
      (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
      end.getUTCMonth() -
      start.getUTCMonth() +
      1
    );
  if (granularity === "week") {
    start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
    end.setUTCDate(end.getUTCDate() - ((end.getUTCDay() + 6) % 7));
  }
  return (
    Math.floor(
      (end.getTime() - start.getTime()) /
        86400000 /
        (granularity === "week" ? 7 : 1),
    ) + 1
  );
}

export function preset(months: number, days = 0) {
  const to = new Date();
  const from = new Date(to);
  if (days) from.setDate(from.getDate() - days + 1);
  else if (months === 3) {
    from.setDate(1);
    from.setMonth(from.getMonth() - 2);
    from.setDate(from.getDate() - ((from.getDay() + 6) % 7));
  } else {
    from.setDate(1);
    from.setMonth(from.getMonth() - (months - 1));
  }
  const date = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return {
    from: date(from),
    to: date(to),
    granularity: days ? "day" : months === 3 ? "week" : "month",
  };
}
