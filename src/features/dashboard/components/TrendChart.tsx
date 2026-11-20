"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardResponse } from "@/types";
import { currentBucket, formatBucket } from "../utils/formatters";
import { ChartCard } from "./ChartCard";
import { chartColors } from "./chartTheme";
export function TrendChart({ data }: { data: DashboardResponse }) {
  const { trends, range } = data;
  const current = currentBucket(range.tz, range.granularity);
  const hasCurrent = trends.some((row) => row.bucket === current);
  return (
    <ChartCard
      title="Activity over time"
      description={`Admissions (left axis) and doctors added (right axis) by ${range.granularity}${hasCurrent ? "; current bucket is in progress" : ""}`}
      empty={!trends.some((v) => v.patientsAdmitted || v.doctorsAdded)}
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="bucket"
              tick={{ fontSize: 11 }}
              minTickGap={35}
              tickFormatter={(value) => formatBucket(value, range.granularity)}
            />
            <YAxis
              yAxisId="patients"
              allowDecimals={false}
              domain={[0, "auto"]}
            />
            <YAxis
              yAxisId="doctors"
              orientation="right"
              allowDecimals={false}
              domain={[0, "auto"]}
            />
            <Tooltip
              labelFormatter={(label) =>
                formatBucket(String(label), range.granularity)
              }
            />
            <Legend />
            {hasCurrent && (
              <ReferenceLine
                yAxisId="patients"
                x={current}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                label={{
                  value: "Current",
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "#64748b",
                }}
              />
            )}
            <Area
              yAxisId="patients"
              type="monotoneX"
              dataKey="patientsAdmitted"
              name="Patients admitted (left)"
              stroke={chartColors[0]}
              fill={chartColors[0]}
              fillOpacity={0.15}
            />
            <Area
              yAxisId="doctors"
              type="monotoneX"
              dataKey="doctorsAdded"
              name="Doctors added (right)"
              stroke={chartColors[1]}
              fill={chartColors[1]}
              fillOpacity={0.12}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="sr-only">
        {trends
          .map(
            (v) =>
              `${formatBucket(v.bucket, range.granularity)}: ${v.patientsAdmitted} patients admitted, ${v.doctorsAdded} doctors added`,
          )
          .join("; ")}
      </p>
    </ChartCard>
  );
}
