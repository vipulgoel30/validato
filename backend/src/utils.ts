// User imports
import { Crypto } from "@mono/utils";

const algorithm: string = "aes-256-cbc";
const { CRYPTO_SECRET_KEY, CRYPTO_IV } = process.env;
export const crypto = new Crypto(algorithm, CRYPTO_SECRET_KEY, CRYPTO_IV);
