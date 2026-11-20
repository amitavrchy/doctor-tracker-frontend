import { ApiError } from "@/lib/api/client";

export type Errors = Record<string, string>;

export function requiredText(value: string, max = 200) {
  if (!value.trim()) return "This field is required.";
  if (value.trim().length > max) return `Must be ${max} characters or fewer.`;
}

export function emailError(value: string, required = false) {
  if (!value && !required) return;
  if (!value.trim()) return "This field is required.";
  if (
    value.length > 254 ||
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/.test(
      value,
    )
  )
    return "Enter a valid email address.";
}

export function serverErrors(error: unknown, fields: string[]) {
  const errors: Errors = {};
  let message =
    error instanceof Error
      ? error.message
      : "Something went wrong. Please try again.";
  if (error instanceof ApiError) {
    if (error.status === 409 && fields.includes("email")) {
      errors.email = "This email is already in use.";
      message = "";
    } else if (
      error.code === "VALIDATION_ERROR" &&
      Array.isArray(error.details)
    ) {
      let unmapped = false;
      for (const issue of error.details) {
        const path = Array.isArray(issue.path) ? issue.path[0] : issue.path;
        if (
          typeof path === "string" &&
          fields.includes(path) &&
          typeof issue.message === "string"
        )
          errors[path] = issue.message;
        else unmapped = true;
      }
      if (Object.keys(errors).length && !unmapped) message = "";
    }
  }
  return { errors, message };
}
