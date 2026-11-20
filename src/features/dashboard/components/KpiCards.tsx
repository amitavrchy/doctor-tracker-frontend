import {
  Activity,
  Stethoscope,
  Users,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Card } from "@/components/ui";
import type { DashboardResponse } from "@/types";
export function KpiCards({ totals }: { totals: DashboardResponse["totals"] }) {
  const items = [
    ["Total doctors", totals.doctors, Stethoscope],
    ["Total patients", totals.patients, Users],
    ["Active", totals.active, Activity],
    ["Discharged", totals.discharged, UserCheck],
    ["New in range", totals.newPatients, UserPlus],
  ] as const;
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
      {items.map(([label, value, Icon]) => (
        <Card key={label} className="p-4 last:col-span-2 xl:last:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <span className="rounded-xl bg-teal-50 p-2 text-teal-700">
              <Icon size={18} aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-900 tabular-nums">
            {value.toLocaleString()}
          </p>
        </Card>
      ))}
    </div>
  );
}
