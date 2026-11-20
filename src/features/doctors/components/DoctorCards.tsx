import Link from "next/link";
import { Badge } from "@/components/ui";
import { formatDate, initials } from "@/lib/utils/format";
import type { Doctor } from "@/types";

export function DoctorCards({ doctors }: { doctors: Doctor[] }) {
  return (
    <div className="divide-y divide-slate-100 md:hidden">
      {doctors.map((doctor) => (
        <Link
          key={doctor._id}
          href={`/doctors/${doctor._id}`}
          className="block p-5 hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold text-teal-700">
              {initials(doctor.name)}
            </span>
            <div className="min-w-0">
              <p className="font-semibold">{doctor.name}</p>
              <p className="break-all text-sm text-slate-500">{doctor.email}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge>{doctor.specialization}</Badge>
            <span className="text-sm text-slate-600">{doctor.hospital}</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            {doctor.phone} · Added {formatDate(doctor.createdAt)}
          </p>
        </Link>
      ))}
    </div>
  );
}
