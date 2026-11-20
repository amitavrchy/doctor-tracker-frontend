"use client";

import { useState, type FormEvent } from "react";
import { Button, Input, Modal, useToast } from "@/components/ui";
import {
  emailError,
  requiredText,
  serverErrors,
  type Errors,
} from "@/features/shared/validation";
import { useCreateDoctor, type DoctorInput } from "../api/hooks";

const fields = [
  { name: "name", label: "Name" },
  { name: "specialization", label: "Specialization" },
  { name: "hospital", label: "Hospital" },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
] as const;
export function DoctorFormDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const mutation = useCreateDoctor();
  const toast = useToast();
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  function close() {
    if (!mutation.isPending) {
      setErrors({});
      setMessage("");
      onClose();
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = Object.fromEntries(
      fields.map(({ name }) => [name, String(data.get(name) || "").trim()]),
    ) as DoctorInput;
    const next: Errors = {};
    for (const { name } of fields) {
      const error =
        name === "email"
          ? emailError(input.email, true)
          : requiredText(input[name]);
      if (error) next[name] = error;
    }
    setErrors(next);
    setMessage("");
    if (Object.keys(next).length) return;
    try {
      await mutation.mutateAsync(input);
      form.reset();
      toast("Doctor added successfully.");
      onClose();
    } catch (error) {
      const result = serverErrors(
        error,
        fields.map((field) => field.name),
      );
      setErrors(result.errors);
      setMessage(result.message);
    }
  }
  return (
    <Modal open={open} onClose={close} title="Add doctor">
      <form onSubmit={submit} noValidate className="flex min-h-0 flex-col">
        <div className="min-h-0 space-y-4 overflow-y-auto pr-1">
          {fields.map(({ name, label }) => (
            <Input
              key={name}
              name={name}
              label={label}
              type={name === "email" ? "email" : "text"}
              maxLength={name === "email" ? 254 : 200}
              error={errors[name]}
            />
          ))}
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
          <Button type="submit" loading={mutation.isPending}>
            Add doctor
          </Button>
        </div>
      </form>
    </Modal>
  );
}
