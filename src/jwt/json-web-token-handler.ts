import jsonwebtoken from "jsonwebtoken";

import type { JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import type { JwtHandler } from "./jwt-handler.js";

export interface JsonWebTokenHandlerOptions {
  signOpts?: SignOptions;
  verifyOpts?: VerifyOptions;
}

export class JsonWebTokenHandler implements JwtHandler {
  private secret: string;
  private signOpts?: SignOptions;
  private verifyOpts?: VerifyOptions;

  constructor(secret: string, opts?: JsonWebTokenHandlerOptions) {
    this.secret = secret;
    this.signOpts = opts?.signOpts;
    this.verifyOpts = opts?.verifyOpts;
  }

  sign(payload: any, opts?: SignOptions): string {
    return jsonwebtoken.sign(payload, this.secret, {
      ...this.signOpts,
      ...opts
    });
  }

  parse<T extends JwtPayload>(token: string, opts?: VerifyOptions): T {
    return jsonwebtoken.verify(token, this.secret, {
      ...this.verifyOpts,
      ...opts
    }) as T;
  }
}
