// User imports
import { type JWT } from "../classes/Jwt.js";
import { type Crypto } from "../classes/Crypto.js";

export interface KeyPayload {
  key: string;
  brand: string;
  generatedAt: Date;
}

export const generateKey = async (keyId: string, brandId: string, crypto: Crypto, jwt: JWT): Promise<string> => {
  const key: string = (await jwt.sign({ key: keyId, brand: brandId, generatedAt: new Date() }, { noTimestamp: true }))!;
  const encryptedKey: string = crypto.encrypter(key, "utf-8", "hex")!;
  return encryptedKey;
};

export const parseKey = async (key: string, crypto: Crypto, jwt: JWT): Promise<KeyPayload | undefined> => {
  const jwtKey: string | undefined = crypto.decrypter(key, "hex", "utf-8");
  console.log(jwtKey);
  if (!jwtKey) return undefined;
  const payload: KeyPayload | undefined = (await jwt.verify(jwtKey, {})) as KeyPayload | undefined;
  return payload;
};
