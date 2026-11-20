"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "./ChartCard";
import { chartColors, type ChartCount } from "./chartTheme";
export function DonutChart({
  title,
  data,
}: {
  title: string;
  data: ChartCount[];
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  return (
    <ChartCard
      title={title}
      description="All-time distribution"
      empty={!data.length || !total}
    >
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="relative h-56 w-56 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="label"
                innerRadius={65}
                outerRadius={95}
              >
                {data.map((item, i) => (
                  <Cell
                    key={item.label}
                    fill={chartColors[i % chartColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="text-2xl font-bold text-slate-900">
              {total.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">Total</span>
          </div>
        </div>
        <ul className="min-w-36 space-y-2">
          {data.map((item, i) => (
            <li
              key={item.label}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: chartColors[i % chartColors.length] }}
              />
              <span className="capitalize">{item.label}</span>
              <span className="ml-auto font-medium text-slate-900">
                {item.count.toLocaleString()} (
                {((item.count / total) * 100).toFixed(1)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="sr-only">Total: {total}.</p>
    </ChartCard>
  );
}
