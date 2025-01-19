// Third party imports
import { EnumLike } from "zod";

export interface FieldErrMsg {
  required?: string;
  minLength?: { length: number; msg: string };
  maxLength?: { length: number; msg: string };
  type?: string;
  format?: string;
}

export interface CreateFieldErrMsgOptions {
  field: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  expectedType?: string;
  enums?: EnumLike;
}

const createFieldErrMsg = ({
  field,
  required = true,
  minLength,
  maxLength,
  expectedType = "string",
  enums,
}: CreateFieldErrMsgOptions): FieldErrMsg => {
  const enumKeys: string[] | undefined = enums && Object.keys(enums).map((values) => `'${values}'`);

  return {
    ...(required && { required: `Missing required field : ${field}` }),
    ...(minLength && {
      minLength: {
        length: minLength,
        msg: `${field} too short. At least ${minLength} characters required!`,
      },
    }),
    ...(maxLength && {
      maxLength: {
        length: maxLength,
        msg: `${field} too long. At most ${maxLength} characters allowed!`,
      },
    }),
    ...(expectedType && {
      type: `Unexpected type for '${field}'. Expected a ${expectedType}.`,
    }),
    ...(enumKeys && {
      format: `Invalid ${field}. Must be ${enumKeys.slice(0, -1).join(", ")}${
        enumKeys.length > 1 ? "" : " or "
      }${enumKeys.at(-1)}.`,
    }),
  };
};

export default createFieldErrMsg;
