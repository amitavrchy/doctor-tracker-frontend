import { config } from "@/lib/config";
import { isLoggingOut } from "@/lib/auth/logout-state";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiResponse<T> = {
  success: true;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

type Options = Omit<RequestInit, "body"> & { body?: unknown };

export function queryString(
  values: Record<string, string | number | boolean | null | undefined>,
) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "")
      params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `?${query}` : "";
}
/* Same-origin /api rewrites preserve the httpOnly cookie and browser Origin.
 * The backend CLIENT_URL must include the frontend origin. An explicit public
 * API override requires compatible CORS and browser cookie policies. */
export async function apiFetch<T>(
  path: string,
  options: Options = {},
): Promise<ApiResponse<T>> {
  const { body, headers, ...rest } = options;
  let response: Response;
  try {
    const requestHeaders = new Headers(headers);
    if (body !== undefined)
      requestHeaders.set("Content-Type", "application/json");
    response = await fetch(`${config.apiUrl}${path}`, {
      ...rest,
      credentials: "include",
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Unable to reach the server. Check your connection and try again.",
    );
  }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const error = new ApiError(
      response.status,
      payload?.error?.code || "SERVER_ERROR",
      payload?.error?.message ||
        (response.status >= 500
          ? "The server is unavailable. Please try again shortly."
          : "Something went wrong. Please try again."),
      payload?.error?.details,
    );
    if (
      response.status === 401 &&
      !isLoggingOut() &&
      !["/auth/login", "/auth/logout"].includes(
        path.split("?")[0].replace(/\/$/, ""),
      ) &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    )
      window.dispatchEvent(new Event("auth:expired"));
    throw error;
  }
  if (!payload || payload.success !== true || !("data" in payload))
    throw new ApiError(
      response.status,
      "INVALID_RESPONSE",
      "The server returned an unexpected response.",
    );
  return payload as ApiResponse<T>;
}

export const api = {
  get: <T>(path: string, opts?: Options) =>
    apiFetch<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: Options) =>
    apiFetch<T>(path, { ...opts, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, opts?: Options) =>
    apiFetch<T>(path, { ...opts, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, opts?: Options) =>
    apiFetch<T>(path, { ...opts, method: "PUT", body }),
  delete: <T>(path: string, opts?: Options) =>
    apiFetch<T>(path, { ...opts, method: "DELETE" }),
};
