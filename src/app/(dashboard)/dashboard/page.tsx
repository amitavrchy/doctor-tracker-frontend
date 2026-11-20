import { Suspense } from "react";
import { Dashboard } from "@/features/dashboard/components/Dashboard";
import { ListLoading } from "@/features/shared/ListLoading";
export const metadata = { title: "Dashboard" };
export default function DashboardPage() {
  return (
    <Suspense fallback={<ListLoading />}>
      <Dashboard />
    </Suspense>
  );
}
