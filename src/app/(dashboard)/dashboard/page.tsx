import { Activity } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, EmptyState } from "@/components/ui";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your care workspace, all in one place."
      />
      <Card>
        <EmptyState
          icon={<Activity />}
          title="Your overview is coming soon"
          description="A clearer picture of your doctors, patients, and activity will appear here."
        />
      </Card>
    </>
  );
}
