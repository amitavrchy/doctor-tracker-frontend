"use client";

import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Pagination,
  useToast,
} from "@/components/ui";
import { ListLoading } from "@/features/shared/ListLoading";
import { useListState } from "@/features/shared/useListState";
import type { Patient } from "@/types";
import { useDoctorPatients, usePatientMutations } from "../api/hooks";
import { AddPatientDialog } from "./AddPatientDialog";
import { PatientFilters } from "./PatientFilters";
import { PatientTable } from "./PatientTable";
import { PatientCards } from "./PatientCards";

const extra = ["condition", "gender", "status"];
export function PatientList({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Patient | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const { values, update, clear, count } = useListState(extra);
  const query = useDoctorPatients(id, values);
  const { remove } = usePatientMutations(id);
  const toast = useToast();
  const patients = query.data?.data || [],
    meta = query.data?.meta;
  async function removePatient() {
    if (!selected) return;
    try {
      await remove.mutateAsync(selected._id);
      if (meta && meta.page > 1 && patients.length === 1)
        update({ page: meta.page - 1 });
      setSelected(null);
      setDeleteError("");
      toast("Patient deleted successfully.");
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Unable to delete patient.",
      );
    }
  }
  const addButton = (
    <Button onClick={() => setOpen(true)}>
      <Plus size={16} /> Add patient
    </Button>
  );
  const deleteButton = (patient: Patient) => (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-700 hover:bg-red-50"
      onClick={() => {
        setDeleteError("");
        setSelected(patient);
      }}
    >
      <Trash2 size={15} aria-hidden="true" /> Delete
      <span className="sr-only"> {patient.name}</span>
    </Button>
  );
  return (
    <section className="mt-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Patients</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage patients under this doctor.
          </p>
        </div>
        {addButton}
      </div>
      <PatientFilters
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
      ) : patients.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Users />}
            title={count ? "No matching patients" : "No patients yet"}
            description={
              count
                ? "Try adjusting or clearing your filters."
                : "Add a patient to this doctor's list."
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
          <PatientTable patients={patients} renderActions={deleteButton} />
          <PatientCards patients={patients} renderActions={deleteButton} />
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
      <AddPatientDialog id={id} open={open} onClose={() => setOpen(false)} />
      <ConfirmDialog
        open={!!selected}
        onClose={() => {
          if (!remove.isPending) setSelected(null);
        }}
        onConfirm={removePatient}
        title="Delete patient"
        confirmLabel="Delete patient"
        description={`Delete ${selected?.name || "this patient"} from this doctor's patient list? This cannot be undone.${deleteError ? ` ${deleteError}` : ""}`}
        loading={remove.isPending}
      />
    </section>
  );
}
