import type { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";

export interface JwtHandler {
  sign(payload: any, opts?: SignOptions): string;

  parse<T extends JwtPayload>(token: string, opts?: VerifyOptions): T;
}
