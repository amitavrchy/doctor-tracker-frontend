"use client";
import { useState, type FormEvent } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import {
  emailError,
  requiredText,
  serverErrors,
  type Errors,
} from "@/features/shared/validation";
import type { Patient } from "@/types";
import type { PatientInput } from "../api/hooks";
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
  "doctor",
];
export function PatientForm({
  patient,
  pending,
  onSubmit,
  onClose,
  children,
  doctorChanged = false,
}: {
  patient?: Patient;
  pending: boolean;
  onSubmit: (input: PatientInput) => Promise<void>;
  onClose: () => void;
  children?: React.ReactNode;
  doctorChanged?: boolean;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  function close() {
    if (!pending) onClose();
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
    if (patient?.email && !get("email"))
      next.email = "The server does not support clearing an email address.";
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
      ...(get("notes") || patient?.notes ? { notes: get("notes") } : {}),
    };
    try {
      await onSubmit(input);
      form.reset();
      onClose();
    } catch (error) {
      const result = serverErrors(error, fields);
      setErrors(result.errors);
      setMessage(result.message);
    }
  }
  return (
    <>
      <form
        onSubmit={submit}
        onChange={(event) => {
          if (!patient) return;
          const data = new FormData(event.currentTarget);
          setDirty(
            [
              "name",
              "age",
              "gender",
              "phone",
              "email",
              "condition",
              "admissionDate",
              "notes",
              "status",
            ].some((key) => {
              const original = patient[key as keyof Patient];
              const value =
                key === "admissionDate" && typeof original === "string"
                  ? original.slice(0, 10)
                  : String(original ?? "");
              return String(data.get(key) ?? "").trim() !== value;
            }),
          );
        }}
        noValidate
        className="flex min-h-0 flex-col"
      >
        <div className="min-h-0 space-y-4 overflow-y-auto pr-1">
          {children}
          {errors.doctor && (
            <p role="alert" className="text-sm text-red-600">
              {errors.doctor}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="name"
              defaultValue={patient?.name ?? ""}
              label="Name"
              maxLength={200}
              error={errors.name}
            />
            <Input
              name="age"
              defaultValue={patient?.age ?? ""}
              label="Age"
              type="number"
              min="0"
              max="150"
              error={errors.age}
            />
            <Select
              name="gender"
              label="Gender"
              defaultValue={patient?.gender || ""}
              error={errors.gender}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
            <Input
              name="phone"
              defaultValue={patient?.phone ?? ""}
              label="Phone"
              maxLength={200}
              error={errors.phone}
            />
            <Input
              name="email"
              defaultValue={patient?.email ?? ""}
              label="Email (optional)"
              type="email"
              maxLength={254}
              error={errors.email}
            />
            <Input
              name="condition"
              defaultValue={patient?.condition ?? ""}
              label="Condition"
              maxLength={200}
              error={errors.condition}
            />
            <Input
              name="admissionDate"
              defaultValue={patient?.admissionDate?.slice(0, 10) ?? ""}
              label="Admission date"
              type="date"
              error={errors.admissionDate}
            />
            <Select
              name="status"
              label="Status"
              defaultValue={patient?.status || "active"}
              error={errors.status}
            >
              <option value="active">Active</option>
              <option value="discharged">Discharged</option>
            </Select>
          </div>
          <Textarea
            name="notes"
            defaultValue={patient?.notes ?? ""}
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
          <Button
            type="submit"
            loading={pending}
            disabled={!!patient && !dirty && !doctorChanged}
          >
            {patient ? "Save changes" : "Add patient"}
          </Button>
        </div>
      </form>
    </>
  );
}
