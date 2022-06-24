/* eslint-disable no-invalid-this */
import { DateTime } from "luxon";

import type { UserToken } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

const jwtKey = "depixy";

export interface AuthJwtPayload {
  userToken: string;
}

export interface SetJwtCookieOptions {
  /**
   * Unit day
   */
  expiresIn?: number;
}

export function setJwtCookie(
  this: FastifyReply,
  userToken: UserToken,
  opts: SetJwtCookieOptions = {}
): void {
  const fastify = this.server;
  const payload: AuthJwtPayload = { userToken: userToken.id };
  const { expiresIn = 30 } = opts;
  const jwt = fastify.jwt.sign(payload, {
    expiresIn: expiresIn > 0 ? expiresIn + "d" : undefined
  });
  const expires =
    expiresIn > 0
      ? DateTime.now().plus({ days: expiresIn }).toJSDate()
      : undefined;
  this.setCookie(jwtKey, jwt, {
    httpOnly: true,
    signed: true,
    expires
  });
}

export function clearJwtCookie(this: FastifyReply): void {
  this.clearCookie(jwtKey);
}

export function getJwtCookie(this: FastifyRequest): string | undefined {
  return this.cookies[jwtKey];
}
