import { JsonWebTokenHandler } from "../json-web-token-handler.js";

test("JsonWebTokenHandler", () => {
  const handler = new JsonWebTokenHandler("secret");
  const obj = { userId: 1 };
  const jwt = handler.sign(obj);
  const decoded = handler.parse(jwt);
  expect(decoded.userId).toEqual(obj.userId);
});

test("JsonWebTokenHandler with difference secret", () => {
  const handler = new JsonWebTokenHandler("secret");
  const handler2 = new JsonWebTokenHandler("secret2");
  const obj = { userId: 1 };
  const jwt = handler.sign(obj);
  expect(() => handler2.parse(jwt)).toThrow();
});
