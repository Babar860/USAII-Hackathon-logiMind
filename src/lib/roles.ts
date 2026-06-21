export const APP_ROLES = ["viewer", "operator", "approver", "admin"] as const;

export type AppRole = (typeof APP_ROLES)[number];
export type Permission = "agent:query" | "alerts:manage" | "decisions:approve";

const rolePermissions: Record<AppRole, readonly Permission[]> = {
  viewer: [],
  operator: ["agent:query", "alerts:manage"],
  approver: ["agent:query", "alerts:manage", "decisions:approve"],
  admin: ["agent:query", "alerts:manage", "decisions:approve"]
};

export const roleLabels: Record<AppRole, string> = {
  viewer: "Read-only Viewer",
  operator: "Operations Analyst",
  approver: "Operations Manager",
  admin: "Platform Administrator"
};

export function isAppRole(value: string | undefined): value is AppRole {
  return APP_ROLES.includes(value as AppRole);
}

export function resolveAppRole(configuredRole: string | undefined, production: boolean): AppRole {
  if (isAppRole(configuredRole)) return configuredRole;
  return production ? "viewer" : "approver";
}

export function getAppRole(): AppRole {
  return resolveAppRole(process.env.APP_USER_ROLE, process.env.NODE_ENV === "production");
}

export function hasPermission(role: AppRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function getAuthorizationSummary() {
  const role = getAppRole();
  return { role, label: roleLabels[role], permissions: rolePermissions[role] };
}
