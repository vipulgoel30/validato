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
    confirmPassword: userSchema.confirmPassword,
  })
  .refine(
    ({ password, confirmPassword }: { password: string; confirmPassword: string }) => password === confirmPassword,
    {
      path: ["Confirm Password"],
      message: "Password and confirm password do not match!!!",
    }
  );

export type LoginI = z.infer<typeof loginSchema>;
export type SignupI = z.infer<typeof signupSchema>;