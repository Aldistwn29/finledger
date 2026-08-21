export const APP_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export function normalizeAppRole(value: unknown): AppRole | undefined {
  if (value === "ADMIN" || value === "Admin") {
    return APP_ROLES.ADMIN;
  }

  if (value === "USER" || value === "User") {
    return APP_ROLES.USER;
  }

  return undefined;
}

export function getAuthenticatedHomePath(role: AppRole, hasBusiness: boolean) {
  if (role === APP_ROLES.ADMIN) {
    return "/admin/dashboard";
  }

  return hasBusiness ? "/app/dashboard" : "/setup/business";
}
