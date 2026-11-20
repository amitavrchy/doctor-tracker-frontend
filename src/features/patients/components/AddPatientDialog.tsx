"use client";
import { Modal, useToast } from "@/components/ui";
import { usePatientMutations } from "../api/hooks";
import { PatientForm } from "./PatientForm";
export function AddPatientDialog({
  id,
  open,
  onClose,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
}) {
  const { add } = usePatientMutations(id);
  const toast = useToast();
  return (
    <Modal
      open={open}
      onClose={() => {
        if (!add.isPending) onClose();
      }}
      title="Add patient"
    >
      {open && (
        <PatientForm
          pending={add.isPending}
          onClose={onClose}
          onSubmit={async (input) => {
            await add.mutateAsync(input);
            toast("Patient added successfully.");
          }}
        />
      )}
    </Modal>
  );
}
