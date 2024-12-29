// User imports
import { userErr } from "../errors/error.js";
import { createStringSchema } from "./utils.js";

export const userSchema = {
  name: createStringSchema(userErr.name),
  email: createStringSchema(userErr.email).email(userErr.email.format!),
  password: createStringSchema(userErr.password),
  confirmPassword: createStringSchema(userErr.confirmPassword),
} as const;
