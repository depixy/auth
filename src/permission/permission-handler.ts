import { Permission } from "./permission.js";

import type { Role } from "@prisma/client";

type Subject = string | symbol;
type Roles = Set<string | null>;

export class PermissionHandler {
  private readonly permissions: Record<Subject, Record<Permission, Roles>> = {};

  register(
    role: string | null,
    subject: string | symbol,
    permissions: Permission[]
  ): void {
    if (!this.permissions[subject]) {
      this.permissions[subject] = {
        [Permission.read]: new Set(),
        [Permission.write]: new Set(),
        [Permission.delete]: new Set()
      };
    }
    for (const permission of permissions) {
      this.permissions[subject][permission].add(role);
    }
  }

  has(
    role: string | Role | null,
    subject: string | symbol,
    permission: Permission
  ): boolean {
    const roleKey = typeof role === "string" ? role : role?.name ?? null;
    return this.permissions[subject]?.[permission]?.has(roleKey) ?? false;
  }

  hasAny(
    roles: (string | Role)[],
    subject: string | symbol,
    permission: Permission
  ): boolean {
    const permissions = this.permissions[subject]?.[permission];
    if (!permissions) {
      return false;
    }
    for (const role of roles) {
      const roleKey = typeof role === "string" ? role : role?.name ?? null;
      if (permissions.has(roleKey)) {
        return true;
      }
    }
    return false;
  }
}
