// User imports
import createFieldErrMsg, { FieldErrMsg } from "./utils";

export const userErr: { [key: string]: FieldErrMsg } = {
  name: createFieldErrMsg({ field: "Name", minLength: 1, maxLength: 100 }),
  email: { ...createFieldErrMsg({ field: "Name" }), format: "Invalid email." },
  password: createFieldErrMsg({ field: "Name", minLength: 8, maxLength: 50 }),
};
