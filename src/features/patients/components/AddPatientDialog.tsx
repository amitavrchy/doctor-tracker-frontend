"use client";

import { useState, type FormEvent } from "react";
import {
  Button,
  Input,
  Modal,
  Select,
  Textarea,
  useToast,
} from "@/components/ui";
import {
  emailError,
  requiredText,
  serverErrors,
  type Errors,
} from "@/features/shared/validation";
import { usePatientMutations, type PatientInput } from "../api/hooks";

const fields = [
  "name",
  "age",
  "gender",
  "phone",
  "email",
  "condition",
  "admissionDate",
  "notes",
  "status",
];
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
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  function close() {
    if (!add.isPending) {
      setErrors({});
      setMessage("");
      onClose();
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget,
      data = new FormData(form);
    const get = (key: string) => String(data.get(key) || "").trim();
    const next: Errors = {};
    for (const field of ["name", "phone", "condition"]) {
      const error = requiredText(get(field));
      if (error) next[field] = error;
    }
    const email = emailError(get("email"));
    if (email) next.email = email;
    const age = get("age");
    if (!age || !/^\d+$/.test(age) || Number(age) > 150)
      next.age = "Enter a whole number between 0 and 150.";
    if (!["male", "female", "other"].includes(get("gender")))
      next.gender = "Select a gender.";
    if (!get("admissionDate") || Number.isNaN(Date.parse(get("admissionDate"))))
      next.admissionDate = "Enter a valid admission date.";
    if (get("notes").length > 5000)
      next.notes = "Must be 5000 characters or fewer.";
    if (!["active", "discharged"].includes(get("status")))
      next.status = "Select a status.";
    setErrors(next);
    setMessage("");
    if (Object.keys(next).length) return;
    const input: PatientInput = {
      name: get("name"),
      age: Number(age),
      gender: get("gender") as PatientInput["gender"],
      phone: get("phone"),
      condition: get("condition"),
      admissionDate: get("admissionDate"),
      status: get("status") as PatientInput["status"],
      ...(get("email") ? { email: get("email") } : {}),
      ...(get("notes") ? { notes: get("notes") } : {}),
    };
    try {
      await add.mutateAsync(input);
      form.reset();
      toast("Patient added successfully.");
      onClose();
    } catch (error) {
      const result = serverErrors(error, fields);
      setErrors(result.errors);
      setMessage(result.message);
    }
  }
  return (
    <Modal open={open} onClose={close} title="Add patient">
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-col">
        <div className="min-h-0 space-y-4 overflow-y-auto pr-1">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="name"
              label="Name"
              maxLength={200}
              error={errors.name}
            />
            <Input
              name="age"
              label="Age"
              type="number"
              min="0"
              max="150"
              error={errors.age}
            />
            <Select
              name="gender"
              label="Gender"
              defaultValue=""
              error={errors.gender}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <Input
              name="phone"
              label="Phone"
              maxLength={200}
              error={errors.phone}
            />
            <Input
              name="email"
              label="Email (optional)"
              type="email"
              maxLength={254}
              error={errors.email}
            />
            <Input
              name="condition"
              label="Condition"
              maxLength={200}
              error={errors.condition}
            />
            <Input
              name="admissionDate"
              label="Admission date"
              type="date"
              error={errors.admissionDate}
            />
            <Select
              name="status"
              label="Status"
              defaultValue="active"
              error={errors.status}
            >
              <option value="active">Active</option>
              <option value="discharged">Discharged</option>
            </Select>
          </div>
          <Textarea
            name="notes"
            label="Notes (optional)"
            maxLength={5000}
            error={errors.notes}
          />
          {message && (
            <p role="alert" className="text-sm text-red-600">
              {message}
            </p>
          )}
        </div>
        <div className="flex shrink-0 justify-end gap-2 border-t border-slate-100 bg-white pt-4">
          <Button type="button" variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" loading={add.isPending}>
            Add patient
          </Button>
        </div>
      </form>
    </Modal>
  );
}
