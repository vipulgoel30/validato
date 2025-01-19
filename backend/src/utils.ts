// User imports
import { Crypto, JWT, type Algorithm } from "@mono/utils";

// Crypto
const { CRYPTO_ALGORITHM, CRYPTO_SECRET_KEY, CRYPTO_IV } = process.env;
export const crypto = new Crypto(CRYPTO_ALGORITHM, CRYPTO_SECRET_KEY, CRYPTO_IV);

// JWT - json web token
const { JWT_ALGORITHM, JWT_SECRET_KEY } = process.env;
export const jwt: JWT = new JWT(JWT_SECRET_KEY, JWT_ALGORITHM as Algorithm);

interface SendMailOptions {
  email: string;
  payload: { [key: string]: any };
}

export const sendMail = ({ email, payload }: SendMailOptions) => {
  console.log(email, payload);
};
