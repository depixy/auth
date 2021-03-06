import type { preHandlerAsyncHookHandler } from "fastify";

import type { AuthJwtPayload } from "./jwt.js";

export const handleHeaderAuth: preHandlerAsyncHookHandler = async (
  req,
  res
) => {
  if (req.auth.user) {
    req.log.debug(
      "Skipping authorization by header because it is already authorized."
    );
    return;
  }

  const { authorization } = req.headers;

  if (!authorization) {
    req.log.debug("Empty authorization header.");
    return;
  }

  if (!authorization.startsWith("Bearer ")) {
    res.code(400);
    res.send("Invalid authorization header format");
    req.log.error(
      { authorization, statusCode: 400 },
      "Invalid authorization header format"
    );
    return;
  }
  const jwt: string = authorization.substring("Bearer ".length).trim();
  try {
    const { userToken }: AuthJwtPayload = req.server.jwt.parse(jwt);
    if (!userToken) {
      req.log.warn({ userToken }, "Invalid authorization header");
      return;
    }
    const token = await req.server.db.userToken.findUnique({
      select: { user: { include: { roles: true } } },
      where: { id: userToken }
    });
    if (!token) {
      req.log.warn({ userToken }, "Invalid authorization header");
      return;
    }
    req.auth.user = token.user;
  } catch (e) {
    req.log.warn(e);
  }
};
