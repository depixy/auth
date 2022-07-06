import type { preHandlerAsyncHookHandler } from "fastify";

import type { AuthJwtPayload } from "./jwt.js";

export const handleCookieAuth: preHandlerAsyncHookHandler = async (
  req,
  res
) => {
  if (req.auth.user) {
    req.log.debug(
      "Skipping authorization by cookie because it is already authorized."
    );
    return;
  }

  const jwt = req.getJwtCookie();
  if (!jwt) {
    req.log.debug("Empty Depixy cookie.");
    return;
  }
  try {
    const { userToken }: AuthJwtPayload = req.server.jwt.parse(jwt);
    if (!userToken) {
      req.log.warn({ userToken }, "Invalid cookie");
      res.clearJwtCookie();
      return;
    }
    const token = await req.server.db.userToken.findUnique({
      select: { user: { include: { roles: true } } },
      where: { id: userToken }
    });
    if (!token) {
      req.log.warn({ userToken }, "Invalid cookie");
      res.clearJwtCookie();
      return;
    }
    req.auth.user = token.user;
  } catch (e) {
    req.log.warn(e);
  }
};
