import { createAuthClient } from "@neondatabase/neon-js/auth";

const authUrl = import.meta.env.VITE_NEON_AUTH_URL?.trim();

export const neonAuthClient = authUrl
  ? createAuthClient(authUrl, { fetchOptions: { credentials: "include" } })
  : null;
