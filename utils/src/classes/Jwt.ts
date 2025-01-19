// Third party imports
import { sign as jwtSign, verify as jwtVerify, type VerifyOptions, type SignOptions, type Algorithm } from "jsonwebtoken";

class JWT {
  constructor(private secret: string, public readonly algorithm: Algorithm) {}

  async sign(payload: String | Record<string, any>, options: SignOptions): Promise<string | undefined> {
    try {
      return await new Promise((resolve, reject) =>
        jwtSign(payload, this.secret, { ...options, algorithm: this.algorithm }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
      );
    } catch (err) {
      return undefined;
    }
  }

  async verify(token: string, options: VerifyOptions) {
    try {
      return await new Promise((resolve, reject) =>
        jwtVerify(token, this.secret, options, (err, result) => {
          if (err) return reject();
          resolve(result);
        })
      );
    } catch (err) {
      return undefined;
    }
  }
}

export { JWT, Algorithm };
