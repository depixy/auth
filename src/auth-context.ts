import type { Role, User } from "@prisma/client";

export interface AuthContext {
  user?: User & { roles: Role[] };
}
