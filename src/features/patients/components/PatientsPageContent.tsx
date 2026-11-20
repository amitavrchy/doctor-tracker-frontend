"use client";
import { useState } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Button,
  Card,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Modal,
  Pagination,
  useToast,
} from "@/components/ui";
import { ListLoading } from "@/features/shared/ListLoading";
import { useListState } from "@/features/shared/useListState";
import type { Patient } from "@/types";
import {
  useGlobalPatientMutations,
  usePatient,
  usePatients,
  type PatientInput,
} from "../api/hooks";
import { PatientFilters } from "./PatientFilters";
import { PatientTable } from "./PatientTable";
import { PatientCards } from "./PatientCards";
import { PatientForm } from "./PatientForm";
import { DoctorPicker } from "./DoctorPicker";
const extra = ["condition", "gender", "status", "doctor"];
const doctorId = (patient: Patient) =>
  typeof patient.doctor === "string"
    ? patient.doctor
    : patient.doctor?._id || "";
export function PatientsPageContent() {
  const { values, update, clear, count } = useListState(extra);
  const list = usePatients(values);
  const patients = list.data?.data || [];
  const meta = list.data?.meta;
  const [editing, setEditing] = useState<Patient | null>(null);
  const [deleting, setDeleting] = useState<Patient | null>(null);
  const [error, setError] = useState("");
  const detail = usePatient(editing?._id || null);
  const { edit, remove } = useGlobalPatientMutations();
  const toast = useToast();
  const [doctor, setDoctor] = useState("");
  async function save(input: PatientInput) {
    const original = detail.data?.data;
    if (!original) return;
    const changed: Record<string, string | number> = {};
    for (const [key, value] of Object.entries(input)) {
      const old = original[key as keyof Patient];
      const normalized =
        key === "admissionDate" && typeof old === "string"
          ? old.slice(0, 10)
          : old;
      if (value !== normalized && value !== undefined) changed[key] = value;
    }
    if (doctor !== doctorId(original)) {
      if (!doctor) throw new Error("Select a doctor.");
      changed.doctor = doctor;
    }
    if (!Object.keys(changed).length) return;
    await edit.mutateAsync({
      id: original._id,
      input: changed,
      doctorIds: [doctorId(original), doctor],
    });
    toast("Patient updated successfully.");
  }
  async function deletePatient() {
    if (!deleting) return;
    try {
      await remove.mutateAsync({
        id: deleting._id,
        doctorIds: [doctorId(deleting)],
      });
      if (meta && meta.page > 1 && patients.length === 1)
        update({ page: meta.page - 1 });
      setDeleting(null);
      toast("Patient deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete patient.",
      );
    }
  }
  const actions = (patient: Patient) => (
    <div className="flex flex-wrap gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setDoctor(doctorId(patient));
          setEditing(patient);
        }}
      >
        <Pencil size={15} /> Edit
        <span className="sr-only"> {patient.name}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-700"
        onClick={() => {
          setError("");
          setDeleting(patient);
        }}
      >
        <Trash2 size={15} /> Delete
        <span className="sr-only"> {patient.name}</span>
      </Button>
    </div>
  );
  return (
    <>
      <PageHeader
        title="Patients"
        description="Find and manage the people in your care."
      />
      <PatientFilters
        values={values}
        count={count}
        onUpdate={update}
        onClear={clear}
        doctorPicker={
          <DoctorPicker
            filterLayout
            label="Doctor"
            value={values.doctor || ""}
            onChange={(doctor) => update({ doctor, page: 1 })}
          />
        }
      />
      {values.doctor && (
        <div className="mb-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => update({ doctor: null, page: 1 })}
          >
            Clear doctor filter ×
          </Button>
        </div>
      )}
      {list.isPending ? (
        <ListLoading />
      ) : list.isError ? (
        <Card>
          <ErrorState
            message={list.error.message}
            onRetry={() => list.refetch()}
          />
        </Card>
      ) : !patients.length ? (
        <Card>
          <EmptyState
            icon={<Users />}
            title={count ? "No matching patients" : "No patients yet"}
            description={
              count
                ? "Try adjusting or clearing your filters."
                : "Patients added to doctors will appear here."
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
              ) : undefined
            }
          />
        </Card>
      ) : (
        <Card>
          <PatientTable
            patients={patients}
            showDoctor
            renderActions={actions}
          />
          <PatientCards
            patients={patients}
            showDoctor
            renderActions={actions}
          />
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
      <Modal
        open={!!editing}
        onClose={() => {
          if (!edit.isPending) setEditing(null);
        }}
        title="Edit patient"
      >
        {detail.isPending ? (
          <ListLoading />
        ) : detail.isError ? (
          <ErrorState
            message={detail.error.message}
            onRetry={() => detail.refetch()}
          />
        ) : (
          detail.data && (
            <PatientForm
              key={detail.data.data._id}
              patient={detail.data.data}
              doctorChanged={doctor !== doctorId(detail.data.data)}
              pending={edit.isPending}
              onClose={() => setEditing(null)}
              onSubmit={save}
            >
              <DoctorPicker
                label="Doctor"
                value={doctor}
                initialName={
                  typeof editing?.doctor === "object"
                    ? editing.doctor?.name
                    : undefined
                }
                onChange={setDoctor}
              />
            </PatientForm>
          )
        )}
      </Modal>
      <ConfirmDialog
        open={!!deleting}
        onClose={() => {
          if (!remove.isPending) setDeleting(null);
        }}
        onConfirm={deletePatient}
        title="Delete patient"
        confirmLabel="Delete patient"
        description={`Delete ${deleting?.name || "this patient"}? This cannot be undone.${error ? ` ${error}` : ""}`}
        loading={remove.isPending}
      />
    </>
  );
}
