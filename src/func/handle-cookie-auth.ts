import type { preHandlerAsyncHookHandler } from "fastify";

export const handleCookieAuth: preHandlerAsyncHookHandler = async (
  req,
  res
) => {
  if (req.auth) {
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
    const { userToken } = req.server.jwtHandler.parse(jwt);
    if (!userToken) {
      req.log.warn({ userToken }, "Invalid cookie");
      res.clearJwtCookie();
      return;
    }
    const token = await req.server.db.userToken.findUnique({
      select: { user: true },
      where: { id: userToken }
    });
    if (!token) {
      res.code(403);
      res.send("Invalid cookie");
      req.log.error({ userToken, statusCode: 403 }, "Invalid cookie");
      return;
    }
    req.auth = { user: token.user };
  } catch (e) {
    req.log.warn(e);
  }
};
