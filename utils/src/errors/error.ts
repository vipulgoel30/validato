// User imports
import { KeyStatus } from "../enum.js";
import createFieldErrMsg from "./utils.js";

export const userErr = {
  name: createFieldErrMsg({ field: "Name", minLength: 1, maxLength: 100 }),
  email: { ...createFieldErrMsg({ field: "Email" }), format: "Invalid email." },
  password: createFieldErrMsg({ field: "Password", minLength: 8, maxLength: 50 }),
  confirmPassword: createFieldErrMsg({ field: "Confirm Password" }),
} as const;

export const brandErr = {
  name: createFieldErrMsg({ field: "Name", minLength: 1, maxLength: 100 }),
} as const;

export const keyErr = {
  status: createFieldErrMsg({ field: "Status", enums: KeyStatus }),
};