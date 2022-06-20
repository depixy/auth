/* eslint-disable no-invalid-this */
import { DateTime } from "luxon";

import type { User } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

const jwtKey = "depixy";

export function setJwtCookie(this: FastifyReply, user: User): void {
  const fastify = this.server;
  const jwt = fastify.jwt.sign({ userId: user.id }, { expiresIn: " 30d" });
  const expires = DateTime.now().plus({ days: 30 });
  this.setCookie(jwtKey, jwt, {
    httpOnly: true,
    signed: true,
    expires: expires.toJSDate()
  });
}

export function clearJwtCookie(this: FastifyReply): void {
  this.clearCookie(jwtKey);
}

export function getJwtCookie(this: FastifyRequest): string | undefined {
  return this.cookies[jwtKey];
}
