import { Suspense } from "react";
import { DoctorDetail } from "@/features/doctors/components/DoctorDetail";
import { ListLoading } from "@/features/shared/ListLoading";

export const metadata = { title: "Doctor details" };
export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<ListLoading />}>
      <DoctorDetail id={id} />
    </Suspense>
  );
}
