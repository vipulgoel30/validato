import { Cipher, createCipheriv, createDecipheriv, Encoding } from "crypto";

export class Crypto {
  secretKey: Buffer;
  initVector: Buffer;
  constructor(public readonly algorithm: string, secretKeyString: string, initVectorString: string) {
    this.secretKey = Buffer.from(secretKeyString, "hex");
    this.initVector = Buffer.from(initVectorString, "hex");
  }

  encrypter(payload: string, inputEnconding: Encoding, outputEncoding: Encoding): string | undefined {
    try {
      const cipher: Cipher = createCipheriv(this.algorithm, this.secretKey, this.initVector);
      let data: string = cipher.update(payload, inputEnconding, outputEncoding);
      return (data += cipher.final(outputEncoding));
    } catch (err) {
      return undefined;
    }
  }

  decrypter(payload: string, inputEnconding: Encoding, outputEncoding: Encoding): string | undefined {
    try {
      const decipher = createDecipheriv(this.algorithm, this.secretKey, this.initVector);
      let data: string = decipher.update(payload, inputEnconding, outputEncoding);
      return (data += decipher.final(outputEncoding));
    } catch (err) {
      return undefined;
    }
  }
}
