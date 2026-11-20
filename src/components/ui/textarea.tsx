import { useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";
import { FieldFrame, fieldClass, type Field } from "./field";

export function Textarea({
  label,
  hint,
  error,
  id,
  className,
  ...props
}: Field & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const generated = useId();
  const fieldId = id || generated;
  return (
    <FieldFrame {...{ label, hint, error }} id={fieldId}>
      <textarea
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={error || hint ? `${fieldId}-description` : undefined}
        className={cn(fieldClass, className)}
        {...props}
      />
    </FieldFrame>
  );
}
