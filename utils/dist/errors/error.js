// User imports
import createFieldErrMsg from "./utils.js";
export const userErr = {
    nameErr: createFieldErrMsg({ field: "Name", minLength: 1, maxLength: 100 }),
    emailErr: { ...createFieldErrMsg({ field: "Name" }), format: "Invalid email." },
    passwordErr: createFieldErrMsg({ field: "Name", minLength: 8, maxLength: 50 }),
};
