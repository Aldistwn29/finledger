export const APP_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export function normalizeAppRole(value: unknown): AppRole | undefined {
  if (value === "ADMIN" || value === "USER") {
    return APP_ROLES.ADMIN;
  }

  if (value === "USER" || value === "User") {
    return APP_ROLES.USER;
  }

  return undefined;
}
