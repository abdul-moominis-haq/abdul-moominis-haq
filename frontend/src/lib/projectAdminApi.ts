import { neonAuthClient } from "@/lib/neonAuth";
import { apiUrl } from "@/lib/api";

export class ProjectAdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ProjectAdminApiError";
    this.status = status;
  }
}

export async function projectAdminRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!neonAuthClient) {
    throw new Error("Neon Auth is not configured for this site");
  }

  const { data, error } = await neonAuthClient.getSession();
  if (error) throw new Error(error.message);
  const token = data.session?.token;
  if (!token) throw new Error("Sign in to manage projects");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(apiUrl(path), { ...init, headers });
  if (response.status === 204) return undefined as T;

  const result: unknown = await response.json();
  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : `Project service returned ${response.status}`;
    throw new ProjectAdminApiError(message, response.status);
  }

  return result as T;
}
