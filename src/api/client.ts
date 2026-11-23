export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "/api/v1"
).replace(/\/$/, "");
const TOKEN_KEY = "refa-optical-access-token";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type ApiEnvelope<T> =
  | { data: T }
  | { error: { code?: string; message?: string } };
let refreshing: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshing) {
    refreshing = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const result = (await response.json()) as ApiEnvelope<{
          accessToken: string;
        }>;
        if (!("data" in result)) return null;
        setAccessToken(result.data.accessToken);
        return result.data.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
  if (response.status === 401 && retry && !path.startsWith("/auth/")) {
    const nextToken = await refreshAccessToken();
    if (nextToken) return request<T>(path, init, false);
  }
  const result = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;
  if (!response.ok || !("data" in result)) {
    const error = "error" in result ? result.error : undefined;
    throw new ApiError(
      error?.message || `Permintaan gagal (${response.status}).`,
      response.status,
      error?.code,
    );
  }
  return result.data;
}

export async function requestBlob(path: string): Promise<Blob> {
  const headers = new Headers();
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    credentials: "include",
  });
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers.set("Authorization", `Bearer ${refreshed}`);
      response = await fetch(`${API_BASE_URL}${path}`, {
        headers,
        credentials: "include",
      });
    }
  }
  if (!response.ok)
    throw new ApiError("File tidak dapat diunduh.", response.status);
  return response.blob();
}
