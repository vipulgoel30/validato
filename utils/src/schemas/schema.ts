// Third party imports
import { EnumLike, ZodNativeEnum, ZodString } from "zod";

// User imports
import { userErr } from "../errors/error.js";
import { createStringSchema } from "./utils.js";

export const userSchema = {
  name: createStringSchema(userErr.name),
  email: createStringSchema(userErr.email),
  password: createStringSchema(userErr.password),
} as const;
