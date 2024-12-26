// User imports
import createFieldErrMsg, { FieldErrMsg } from "./utils.js";

export const userErr: { [key: string]: FieldErrMsg } = {
  nameErr: createFieldErrMsg({ field: "Name", minLength: 1, maxLength: 100 }),
  emailErr: { ...createFieldErrMsg({ field: "Name" }), format: "Invalid email." },
  passwordErr: createFieldErrMsg({ field: "Name", minLength: 8, maxLength: 50 }),
} as const;
