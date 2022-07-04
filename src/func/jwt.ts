/* eslint-disable no-invalid-this */
import { DateTime } from "luxon";

import type { UserToken } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

const jwtKey = "depixy";

export interface AuthJwtPayload {
  userToken: string;
}

export function setJwtCookie(this: FastifyReply, userToken: UserToken): void {
  const fastify = this.server;
  const payload: AuthJwtPayload = { userToken: userToken.id };
  let expires: Date | undefined;
  let expiresIn: string | undefined;
  if (userToken.expiredOn) {
    expires = userToken.expiredOn;
    const expiredOnDateTime = DateTime.fromJSDate(userToken.expiredOn);
    const days = DateTime.now().diff(expiredOnDateTime).days + 1;
    if (days > 0) {
      expiresIn = days + "d";
    }
  }
  const jwt = fastify.jwt.sign(payload, { expiresIn });
  this.setCookie(jwtKey, jwt, {
    httpOnly: true,
    expires
  });
}

export function clearJwtCookie(this: FastifyReply): void {
  this.clearCookie(jwtKey);
}

export function getJwtCookie(this: FastifyRequest): string | undefined {
  return this.cookies[jwtKey];
}
