// Third party imports
import { z } from "zod";

// User imports
import { userSchema } from "../schema.js";

export const loginSchema = z.object({
  name: userSchema.name,
  email: userSchema.email,
});

export const signupSchema = z
  .object({
    name: userSchema.name,
    email: userSchema.email,
    password: userSchema.password,
    confirmPassword: userSchema.password,
  })
  .refine(
    ({ password, confirmPassword }: { password: string; confirmPassword: string }) => password === confirmPassword,
    "Password and confirm password do not match!!!"
  );
