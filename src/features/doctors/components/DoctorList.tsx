"use client";

import { useState } from "react";
import { Plus, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Pagination,
} from "@/components/ui";
import { ListLoading } from "@/features/shared/ListLoading";
import { useListState } from "@/features/shared/useListState";
import { useDoctors } from "../api/hooks";
import { DoctorFormDialog } from "./DoctorFormDialog";
import { DoctorFilters } from "./DoctorFilters";
import { DoctorTable } from "./DoctorTable";
import { DoctorCards } from "./DoctorCards";

const extra = ["specialization", "hospital"];
export function DoctorList() {
  const [open, setOpen] = useState(false);
  const { values, update, clear, count } = useListState(extra);
  const query = useDoctors(values);
  const doctors = query.data?.data || [];
  const meta = query.data?.meta;
  const addButton = (
    <Button onClick={() => setOpen(true)}>
      <Plus size={16} /> Add doctor
    </Button>
  );
  return (
    <>
      <PageHeader
        title="Doctors"
        description="Find and manage the doctors in your network."
        actions={addButton}
      />
      <DoctorFilters
        values={values}
        count={count}
        onUpdate={update}
        onClear={clear}
      />
      {query.isPending ? (
        <ListLoading />
      ) : query.isError ? (
        <Card>
          <ErrorState
            message={query.error.message}
            onRetry={() => query.refetch()}
          />
        </Card>
      ) : doctors.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Stethoscope />}
            title={count ? "No matching doctors" : "No doctors yet"}
            description={
              count
                ? "Try adjusting or clearing your filters."
                : "Add your first doctor to start building your directory."
            }
            action={
              meta && meta.page > 1 ? (
                <Button
                  variant="secondary"
                  onClick={() =>
                    update({
                      page: Math.min(
                        meta.page - 1,
                        Math.max(1, meta.totalPages),
                      ),
                    })
                  }
                >
                  Go to previous page
                </Button>
              ) : count ? (
                <Button variant="secondary" onClick={clear}>
                  Clear filters
                </Button>
              ) : (
                addButton
              )
            }
          />
        </Card>
      ) : (
        <Card>
          <DoctorTable doctors={doctors} />
          <DoctorCards doctors={doctors} />
          {meta && (
            <div className="border-t border-slate-100 p-5">
              <Pagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                onPageChange={(page) => update({ page })}
              />
            </div>
          )}
        </Card>
      )}
      <DoctorFormDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
