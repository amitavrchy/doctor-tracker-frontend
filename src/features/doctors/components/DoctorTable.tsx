import Link from "next/link";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui";
import { formatDate } from "@/lib/utils/format";
import type { Doctor } from "@/types";

export function DoctorTable({ doctors }: { doctors: Doctor[] }) {
  return (
    <div className="hidden md:block">
      <Table>
        <TableHead>
          <TableRow>
            {["Doctor", "Specialization", "Hospital", "Phone", "Added", ""].map(
              (title, i) => (
                <TableCell key={i} header>
                  {title}
                </TableCell>
              ),
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {doctors.map((doctor) => (
            <tr
              key={doctor._id}
              className="relative hover:bg-slate-50 focus-within:bg-teal-50 focus-within:outline-2 focus-within:outline-offset-[-2px] focus-within:outline-teal-600"
            >
              <TableCell>
                <span className="font-semibold text-slate-900">
                  {doctor.name}
                </span>
                <div className="mt-1 text-xs text-slate-500">
                  {doctor.email}
                </div>
                <Link
                  href={`/doctors/${doctor._id}`}
                  aria-label={`View ${doctor.name}`}
                  className="absolute inset-0 rounded-sm focus:outline-none"
                />
              </TableCell>
              <TableCell>
                <Badge>{doctor.specialization}</Badge>
              </TableCell>
              <TableCell>{doctor.hospital}</TableCell>
              <TableCell>{doctor.phone}</TableCell>
              <TableCell>{formatDate(doctor.createdAt)}</TableCell>
              <TableCell>
                <span className="font-semibold text-teal-700">View</span>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
