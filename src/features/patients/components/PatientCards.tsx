import type { ReactNode } from "react";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils/format";
import type { Patient } from "@/types";

export function PatientCards({
  patients,
  showDoctor = false,
  renderActions,
}: {
  patients: Patient[];
  showDoctor?: boolean;
  renderActions?: (patient: Patient) => ReactNode;
}) {
  return (
    <div className="divide-y divide-slate-100 md:hidden">
      {patients.map((patient) => (
        <div key={patient._id} className="p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold">{patient.name}</p>
              <p className="mt-1 break-words text-sm text-slate-500">
                {patient.phone}
                {patient.email && ` · ${patient.email}`}
              </p>
            </div>
            {renderActions?.(patient)}
          </div>
          <p className="mt-3 text-sm capitalize text-slate-600">
            {patient.age} years · {patient.gender} · {patient.condition}
          </p>
          {showDoctor && (
            <p className="mt-2 text-sm text-slate-500">
              Doctor:{" "}
              {typeof patient.doctor === "object" && patient.doctor
                ? patient.doctor.name
                : "—"}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <Badge className="capitalize">{patient.status}</Badge>
            <span className="text-sm text-slate-500">
              Admitted {formatDate(patient.admissionDate)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
