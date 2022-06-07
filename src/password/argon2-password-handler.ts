import argon2 from "argon2";

import type { PasswordHandler } from "./password-handler";
import type { Options as Argon2Options } from "argon2";

/**
 * @see https://github.com/ranisalt/node-argon2/wiki/Options
 */
export interface Argon2PasswordHandlerOptions {
  /**
   * The hash length is the length of the hash function output in bytes. Note that the resulting hash is encoded with Base 64, so the digest will be ~1/3 longer.
   *
   * The default value is `32`, which produces raw hashes of 32 bytes or digests of 43 characters.
   */
  hashLength?: number;
  /**
   * The time cost is the amount of passes (iterations) used by the hash function. It increases hash strength at the cost of time required to compute.
   *
   * The default value is `3`.
   */
  timeCost?: number;
  /**
   * The amount of memory to be used by the hash function, in KiB. Each thread (see parallelism) will have a memory pool of this size. Note that large values for highly concurrent usage will cause starvation and thrashing if your system memory gets full.
   *
   * The default value is `4096`, meaning a pool of 4 MiB per thread.
   */
  memoryCost?: number;
  /**
   * The amount of threads to compute the hash on. Each thread has a memory pool with memoryCost size. Note that changing it also changes the resulting hash.
   *
   * The default value is `1`, meaning a single thread is used.
   */
  parallelism?: number;
  /**
   * The variant of the hash function. Argon2 has several variants with different aims:
   *
   * - `argon2d` is faster and highly resistant against GPU attacks, which is useful for cryptocurrency.
   * - `argon2i` is slower and resistant against tradeoff attacks, which is preferred for password hashing and key derivation.
   * - `argon2id` is a hybrid combination of the above, being resistant against GPU and tradeoff attacks.
   *
   * The default is `argon2i`, and the types are available as attributes of the module.
   */
  type?: Argon2Options["type"];
  /**
   * The length (in bytes) of the cryptographically secure random salt to generate.
   *
   * The default value is `16`, as recommended for password hashing in the argon2 specs.
   */
  saltLength?: number;
}

export class Argon2PasswordHandler implements PasswordHandler {
  private readonly opts?: Argon2PasswordHandlerOptions;

  constructor(opts?: Argon2PasswordHandlerOptions) {
    this.opts = opts;
  }

  async hash(password: string): Promise<string> {
    return argon2.hash(password, this.opts);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return argon2.verify(passwordHash, password);
  }
}
