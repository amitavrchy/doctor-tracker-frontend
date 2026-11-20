import { UsersRound } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, EmptyState } from "@/components/ui";

export const metadata = { title: "Patients" };

export default function PatientsPage() {
  return (
    <>
      <PageHeader
        title="Patients"
        description="Keep track of the people in your care."
      />
      <Card>
        <EmptyState
          icon={<UsersRound />}
          title="Patient management is coming soon"
          description="Your patient directory will be available here."
        />
      </Card>
    </>
  );
}
