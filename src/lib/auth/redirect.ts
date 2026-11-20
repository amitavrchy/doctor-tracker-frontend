export function safeNext(value: string | null | undefined): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f]/.test(value)
  )
    return "/dashboard";
  try {
    const url = new URL(value, "http://internal.local");
    if (
      url.origin !== "http://internal.local" ||
      url.pathname === "/login" ||
      url.pathname.startsWith("/api/")
    )
      return "/dashboard";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/dashboard";
  }
}
