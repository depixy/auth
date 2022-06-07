import type { preHandlerAsyncHookHandler } from "fastify";

export const handleHeaderAuth: preHandlerAsyncHookHandler = async (
  req,
  res
) => {
  if (req.auth) {
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
    const { userToken } = req.server.jwtHandler.parse(jwt);
    if (!userToken) {
      req.log.warn({ userToken }, "Invalid authorization header");
      return;
    }
    const token = await req.server.db.userToken.findUnique({
      select: { user: true },
      where: { id: userToken }
    });
    if (!token) {
      res.code(403);
      res.send("Invalid authorization header");
      req.log.error(
        { userToken, statusCode: 403 },
        "Invalid authorization header"
      );
      return;
    }
    req.auth = { user: token.user };
  } catch (e) {
    req.log.warn(e);
  }
};
