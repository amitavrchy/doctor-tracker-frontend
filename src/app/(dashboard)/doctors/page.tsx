import { Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, EmptyState } from "@/components/ui";

export const metadata = { title: "Doctors" };

export default function DoctorsPage() {
  return (
    <>
      <PageHeader
        title="Doctors"
        description="Find and manage the doctors in your network."
      />
      <Card>
        <EmptyState
          icon={<Stethoscope />}
          title="Doctor management is coming soon"
          description="Your doctor directory will be available here."
        />
      </Card>
    </>
  );
}
