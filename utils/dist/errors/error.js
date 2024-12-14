// User imports
import createFieldErrMsg from "./utils";
export const userErr = {
    name: createFieldErrMsg({ field: "Name", minLength: 1, maxLength: 100 }),
    email: { ...createFieldErrMsg({ field: "Name" }), format: "Invalid email." },
    password: createFieldErrMsg({ field: "Name", minLength: 8, maxLength: 50 }),
};
