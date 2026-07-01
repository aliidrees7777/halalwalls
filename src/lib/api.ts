/**
 * HalalWalls API client — the single gateway between the frontend and the
 * backend (Express). Environment-aware:
 *
 *   • Base URL comes from NEXT_PUBLIC_API_URL.
 *       - development → http://localhost:3662/api/v1   (.env.local)
 *       - production  → set on the host / .env.production (provided later)
 *   • Falls back to the local dev URL if the env var is unset.
 *
 * Responsibilities:
 *   - Prefix every request with the API base.
 *   - Attach the JWT (Authorization: Bearer <token>) when the user is signed in.
 *   - Unwrap the standard response envelope → return `data`.
 *   - Throw a typed ApiError (carrying statusCode + message) on failures, so
 *     the UI can branch on 401 (show the sign-in modal), 404, etc.
 */

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3662/api/v1"
).replace(/\/$/, "");

const TOKEN_KEY = "hw_token";

// ── token storage (client-side only) ──
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

// ── dead-session hook ──
// Invoked when an authenticated request is rejected with 401 (expired token,
// password changed elsewhere, account deactivated). Lets the auth layer clear
// its React state so the UI stops showing a "logged-in" user whose every action
// silently fails. Registered by AuthProvider.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null) {
  onUnauthorized = fn;
}

// ── error type ──
export class ApiError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
  /** True when the failure is "you must sign in" (drives the auth modal). */
  get isAuth() {
    return this.statusCode === 401;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Override/force a token (e.g. server-side). Defaults to localStorage. */
  token?: string | null;
  /** Extra headers. */
  headers?: Record<string, string>;
  /** Next.js fetch cache control for server components. */
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, headers = {}, cache, next } = options;

  const authToken = token !== undefined ? token : getToken();
  const finalHeaders: Record<string, string> = { ...headers };
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }
  if (authToken) finalHeaders.Authorization = `Bearer ${authToken}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
      cache,
      next,
    });
  } catch {
    throw new ApiError("Network error — could not reach the server.", 0);
  }

  // Every endpoint returns the standard JSON envelope.
  let json: { status?: string; message?: string; data?: T } = {};
  try {
    json = await res.json();
  } catch {
    // non-JSON (shouldn't happen) — surface a generic error
  }

  if (!res.ok || json.status === "error") {
    // A 401 on an authenticated (non-/auth) request means the stored session is
    // no longer valid. Drop the dead token and notify the auth layer so the UI
    // reflects a logged-out state instead of a zombie session that fails silently.
    if (res.status === 401 && authToken && !path.startsWith("/auth/")) {
      setToken(null);
      onUnauthorized?.();
    }
    throw new ApiError(json.message || `Request failed (${res.status})`, res.status);
  }
  return json.data as T;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
