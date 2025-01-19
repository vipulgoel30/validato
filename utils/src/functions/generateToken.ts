// Core imports
import { randomUUID } from "crypto";

// User imports
import { Crypto } from "../classes/Crypto";

export interface GenerateTokenReturnType {
  token: string;
  encryptedToken: string;
}

export const generateToken = (crypto: Crypto, prefix?: string, suffix?: string): GenerateTokenReturnType => {
  const token: string = (prefix ?? "") + randomUUID() + (suffix ?? "");
  const encryptedToken: string = crypto.encrypter(token, "utf-8", "hex")!;
  return { token, encryptedToken };
};
