import { Argon2PasswordHandler } from "../argon2-password-handler.js";

test("Argon2PasswordHandler", async () => {
  const handler = new Argon2PasswordHandler();
  const password = "password";
  const hash = await handler.hash(password);
  const match = await handler.compare(password, hash);
  expect(match).toBe(true);
});

test("Argon2PasswordHandler with difference password", async () => {
  const handler = new Argon2PasswordHandler();
  const password = "password";
  const hash = await handler.hash(password);
  const match = await handler.compare("password2", hash);
  expect(match).toBe(false);
});
