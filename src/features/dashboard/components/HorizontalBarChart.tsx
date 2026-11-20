"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { chartColors, type ChartCount } from "./chartTheme";
export function HorizontalBarChart({
  title,
  description = "All-time distribution",
  data,
  linkDoctors = false,
}: {
  title: string;
  description?: string;
  data: ChartCount[];
  linkDoctors?: boolean;
}) {
  const router = useRouter();
  return (
    <ChartCard title={title} description={description} empty={!data.length}>
      <div className="max-h-[520px] overflow-y-auto">
        <div style={{ height: Math.max(256, data.length * 34 + 40) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 35 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={125}
                interval={0}
                tick={{ fontSize: 11 }}
                tickFormatter={(label: string) =>
                  label.length > 18 ? `${label.slice(0, 17)}…` : label
                }
              />
              <Tooltip />
              <Bar
                dataKey="count"
                name={linkDoctors ? "Patients" : "Count"}
                fill={chartColors[0]}
                radius={[0, 4, 4, 0]}
                cursor={linkDoctors ? "pointer" : undefined}
                onClick={(entry) => {
                  if (linkDoctors && entry.id)
                    router.push(`/doctors/${entry.id}`);
                }}
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  fill="#475569"
                  fontSize={11}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <ul className="sr-only">
        {data.map((item, i) => (
          <li key={`${item.label}-${i}`}>
            {linkDoctors && item.id ? (
              <Link href={`/doctors/${item.id}`}>
                {item.label}: {item.count}
              </Link>
            ) : (
              `${item.label}: ${item.count}`
            )}
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
