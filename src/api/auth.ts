import { request, setAccessToken } from "./client";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}
export interface AuthResult {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export function getCurrentUser() {
  return request<AuthUser>("/auth/me");
}

export async function authenticate(
  mode: "login" | "register",
  payload: { name?: string; email: string; password: string },
) {
  const result = await request<AuthResult>(
    `/auth/${mode === "login" ? "login" : "register"}`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  setAccessToken(result.accessToken);
  return result;
}

export async function logout() {
  try {
    await request("/auth/logout", { method: "POST" });
  } finally {
    setAccessToken(null);
  }
}

export async function refreshSession() {
  const result = await request<AuthResult>("/auth/refresh", { method: "POST" });
  setAccessToken(result.accessToken);
  return result;
}
