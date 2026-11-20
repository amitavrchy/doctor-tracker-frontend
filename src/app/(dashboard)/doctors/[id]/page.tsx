import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, EmptyState } from "@/components/ui";

export const metadata = { title: "Doctor details" };

export default function DoctorDetailPage() {
  return (
    <>
      <PageHeader
        title="Doctor details"
        description="View a doctor and their patient records."
        breadcrumbs={
          <Link href="/doctors" className="hover:text-teal-700">
            Doctors
          </Link>
        }
      />
      <Card>
        <EmptyState
          icon={<Stethoscope />}
          title="Doctor details are coming soon"
          description="Information about this doctor will appear here."
        />
      </Card>
    </>
  );
}
