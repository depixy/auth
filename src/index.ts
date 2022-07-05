import { plugin } from "./plugin.js";
import type {} from "@depixy/database";
import type {} from "@fastify/cookie";

export * from "./password/index.js";
export * from "./jwt/index.js";
export * from "./auth-context.js";

export type { DepixyAuthOptions } from "./plugin.js";
export default plugin;
