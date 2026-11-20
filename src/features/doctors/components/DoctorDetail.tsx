"use client";

import Link from "next/link";
import { ArrowLeft, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge, Card, EmptyState, ErrorState } from "@/components/ui";
import { ApiError } from "@/lib/api/client";
import { formatDate, initials } from "@/lib/utils/format";
import { ListLoading } from "@/features/shared/ListLoading";
import { PatientList } from "@/features/patients/components/PatientList";
import { useDoctor } from "../api/hooks";

export function DoctorDetail({ id }: { id: string }) {
  const query = useDoctor(id);
  const back = (
    <Link
      href="/doctors"
      className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:underline"
    >
      <ArrowLeft size={16} /> Doctors
    </Link>
  );
  if (
    !/^[a-f\d]{24}$/i.test(id) ||
    (query.error instanceof ApiError && query.error.status === 404)
  )
    return (
      <>
        <PageHeader title="Doctor not found" breadcrumbs={back} />
        <Card>
          <EmptyState
            icon={<Stethoscope />}
            title="Doctor not found"
            description="This doctor may have been removed or the link may be invalid."
            action={back}
          />
        </Card>
      </>
    );
  if (query.isPending)
    return (
      <>
        <PageHeader title="Doctor details" breadcrumbs={back} />
        <ListLoading />
      </>
    );
  if (query.isError)
    return (
      <>
        <PageHeader title="Doctor details" breadcrumbs={back} />
        <Card>
          <ErrorState
            message={query.error.message}
            onRetry={() => query.refetch()}
          />
        </Card>
      </>
    );
  const doctor = query.data.data;
  return (
    <>
      <PageHeader
        title={doctor.name}
        description="Doctor profile and patient records."
        breadcrumbs={back}
      />
      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-teal-50 text-lg font-bold text-teal-700">
            {initials(doctor.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{doctor.name}</h2>
            <div className="mt-2">
              <Badge>{doctor.specialization}</Badge>
            </div>
          </div>
          <div className="ml-auto rounded-xl bg-slate-50 px-4 py-3 text-center">
            <p className="text-xl font-bold text-slate-900">
              {doctor.patientCount ?? 0}
            </p>
            <p className="text-xs text-slate-500">Patients</p>
          </div>
        </div>
        <dl className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Hospital", doctor.hospital],
            ["Phone", doctor.phone],
            ["Email", doctor.email],
            ["Added", formatDate(doctor.createdAt)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
              </dt>
              <dd className="mt-1 break-words text-sm font-medium text-slate-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
      <PatientList id={id} />
    </>
  );
}
