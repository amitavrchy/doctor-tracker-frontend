import Link from "next/link";
import type { ReactNode } from "react";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui";
import { formatDate } from "@/lib/utils/format";
import type { Patient } from "@/types";

export function PatientTable({
  patients,
  showDoctor = false,
  renderActions,
}: {
  patients: Patient[];
  showDoctor?: boolean;
  renderActions?: (patient: Patient) => ReactNode;
}) {
  const headings = [
    "Patient",
    "Age / gender",
    ...(showDoctor ? ["Doctor"] : []),
    "Condition",
    "Admitted",
    "Status",
    ...(renderActions ? ["Actions"] : []),
  ];
  return (
    <div className="hidden lg:block">
      <Table>
        <TableHead>
          <TableRow>
            {headings.map((title) => (
              <TableCell key={title} header>
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient._id}>
              <TableCell>
                <span className="font-semibold">{patient.name}</span>
                <div className="mt-1 text-xs text-slate-500 tabular-nums">
                  {patient.phone}
                  {patient.email && ` · ${patient.email}`}
                </div>
              </TableCell>
              <TableCell>
                <span className="capitalize tabular-nums">
                  {patient.age} / {patient.gender}
                </span>
              </TableCell>
              {showDoctor && (
                <TableCell>
                  {typeof patient.doctor === "object" && patient.doctor ? (
                    <Link
                      className="text-teal-700 hover:underline"
                      href={`/doctors/${patient.doctor._id}`}
                    >
                      {patient.doctor.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </TableCell>
              )}
              <TableCell>{patient.condition}</TableCell>
              <TableCell>
                <span className="tabular-nums">
                  {formatDate(patient.admissionDate)}
                </span>
              </TableCell>
              <TableCell>
                <Badge className="capitalize">{patient.status}</Badge>
              </TableCell>
              {renderActions && <TableCell>{renderActions(patient)}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
