import { Suspense } from "react";
import { DoctorList } from "@/features/doctors/components/DoctorList";
import { ListLoading } from "@/features/shared/ListLoading";

export const metadata = { title: "Doctors" };
export default function DoctorsPage() {
  return (
    <Suspense fallback={<ListLoading />}>
      <DoctorList />
    </Suspense>
  );
}
