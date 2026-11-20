import type { DashboardResponse } from "@/types";
import { HorizontalBarChart } from "./HorizontalBarChart";
export function PatientsPerDoctorChart({
  data,
}: {
  data: DashboardResponse["patientsPerDoctor"];
}) {
  return (
    <HorizontalBarChart
      title="Patients per doctor"
      description="Doctors with the most patients, all-time. Select a bar to view a doctor."
      data={data.map((item) => ({
        label: item.doctor?.name || "Unknown doctor",
        count: item.count,
        id: item.doctor?.id,
      }))}
      linkDoctors
    />
  );
}
