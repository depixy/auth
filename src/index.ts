import { plugin } from "./plugin";
import type {} from "@depixy/database";
import type {} from "@fastify/cookie";

export * from "./password";
export * from "./jwt";

export type { DepixyAuthOptions } from "./plugin";
export default plugin;
