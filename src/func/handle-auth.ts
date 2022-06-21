import type { preHandlerAsyncHookHandler } from "fastify";
import type { Permission } from "../permission/index.js";

export const handleAuth: preHandlerAsyncHookHandler = async req => {
  const roles = req.auth.user?.roles ?? [];
  if (roles.length <= 0) {
    req.auth.hasPermission = (
      subject: string | symbol,
      permission: Permission
    ) => req.server.permission.has(null, subject, permission);
  } else {
    req.auth.hasPermission = (
      subject: string | symbol,
      permission: Permission
    ) => req.server.permission.hasAny(roles, subject, permission);
  }
};
