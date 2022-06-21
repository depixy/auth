import type { Role, User } from "@prisma/client";
import type { Permission } from "./permission/index.js";

export interface AuthContext {
  user?: User & { roles: Role[] };
  hasPermission(subject: string | symbol, permission: Permission): boolean;
}
