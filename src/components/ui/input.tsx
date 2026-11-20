import { useId, type ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils/cn";
import { FieldFrame, fieldClass, type Field } from "./field";

export function Input({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: Field & ComponentPropsWithRef<"input">) {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <FieldFrame {...{ label, hint, error }} id={fieldId}>
      <input
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${fieldId}-description` : undefined}
        className={cn(fieldClass, error && "border-red-400", className)}
        {...props}
      />
    </FieldFrame>
  );
}
