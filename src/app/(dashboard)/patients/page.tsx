import { Suspense } from "react";
import { PatientsPageContent } from "@/features/patients/components/PatientsPageContent";
import { ListLoading } from "@/features/shared/ListLoading";
export const metadata = { title: "Patients" };
export default function PatientsPage() {
  return (
    <Suspense fallback={<ListLoading />}>
      <PatientsPageContent />
    </Suspense>
  );
}
