import { useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { FieldFrame, fieldClass, type Field } from "./field";

export function Select({
  label,
  hint,
  error,
  id,
  className,
  children,
  ...props
}: Field & SelectHTMLAttributes<HTMLSelectElement>) {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <FieldFrame {...{ label, hint, error }} id={fieldId}>
      <select
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${fieldId}-description` : undefined}
        className={cn(fieldClass, className)}
        {...props}
      >
        {children}
      </select>
    </FieldFrame>
  );
}
