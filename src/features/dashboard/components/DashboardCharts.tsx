"use client";
import type { DashboardResponse } from "@/types";
import { DonutChart } from "./DonutChart";
import { HorizontalBarChart } from "./HorizontalBarChart";
import { PatientsPerDoctorChart } from "./PatientsPerDoctorChart";
import { TrendChart } from "./TrendChart";
export function DashboardCharts({ data }: { data: DashboardResponse }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <TrendChart data={data} />
      </div>
      <PatientsPerDoctorChart data={data.patientsPerDoctor} />
      <HorizontalBarChart
        title="Patients by condition"
        data={data.patientsByCondition}
      />
      <DonutChart title="Patients by status" data={data.patientsByStatus} />
      <DonutChart title="Patients by gender" data={data.patientsByGender} />
      <HorizontalBarChart
        title="Doctors by specialization"
        data={data.doctorsBySpecialization}
      />
    </div>
  );
}
