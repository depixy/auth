import { default as fastifyPlugin } from "fastify-plugin";

import { JsonWebTokenHandler } from "./jwt/index.js";
import { Argon2PasswordHandler } from "./password/index.js";
import {
  clearJwtCookie,
  getJwtCookie,
  handleCookieAuth,
  handleHeaderAuth,
  setJwtCookie
} from "./func/index.js";

import type {} from "@depixy/database";
import type { AuthContext } from "./auth-context.js";
import type {
  Argon2PasswordHandlerOptions,
  PasswordHandler
} from "./password/index.js";
import type { JsonWebTokenHandlerOptions, JwtHandler } from "./jwt/index.js";

export interface DepixyAuthOptions {
  passwordHandler?: PasswordHandler;
  argon2PasswordHandlerOpts?: Argon2PasswordHandlerOptions;

  secret: string;
  jwtHandler?: JwtHandler;
  jsonWebTokenHandlerOpts?: JsonWebTokenHandlerOptions;
}

export const plugin = fastifyPlugin<DepixyAuthOptions>(
  async (fastify, opts) => {
    if (!opts) {
      throw new Error("Options must be defined");
    }
    if (fastify.hasRequestDecorator("auth")) {
      throw new Error("@depixy/auth has already registered");
    }
    fastify.decorateRequest("auth", null);
    fastify.decorate(
      "passwordHandler",
      opts.passwordHandler ??
        new Argon2PasswordHandler(opts.argon2PasswordHandlerOpts)
    );
    fastify.decorateRequest(
      "jwtHandler",
      opts.jwtHandler ??
        new JsonWebTokenHandler(opts.secret, opts.jsonWebTokenHandlerOpts)
    );
    fastify.addHook("preHandler", handleHeaderAuth);
    fastify.addHook("preHandler", handleCookieAuth);

    fastify.decorateRequest("getJwtCookie", getJwtCookie);
    fastify.decorateReply("clearJwtCookie", clearJwtCookie);
    fastify.decorateReply("setJwtCookie", setJwtCookie);
  },
  {
    name: "@depixy/auth",
    dependencies: ["@fastify/cookie", "@depixy/database"],
    fastify: "3.x"
  }
);

declare module "fastify" {
  interface FastifyInstance {
    passwordHandler: PasswordHandler;
    jwtHandler: JwtHandler;
  }

  interface FastifyRequest {
    auth: AuthContext | null;
    getJwtCookie: typeof getJwtCookie;
  }

  interface FastifyReply {
    clearJwtCookie: typeof clearJwtCookie;
    setJwtCookie: typeof setJwtCookie;
  }
}
