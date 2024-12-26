// Third party imports
import z, { EnumLike, ZodNativeEnum, ZodString } from "zod";

// User imports
import { FieldErrMsg } from "../errors/utils.js";

export const createStringSchema = (fieldErrs: FieldErrMsg): ZodString => {
  const { type, required, minLength, maxLength } = fieldErrs;
  let schema: ZodString = z.string({
    ...(required && { required_error: required }),
    ...(type && { invalid_type_error: type }),
  });
  if (minLength) schema = schema.min(minLength.length, minLength.msg);
  if (maxLength) schema = schema.min(maxLength.length, maxLength.msg);
  return schema;
};

export const createEnumSchema = (enums: EnumLike, fieldErrs: FieldErrMsg): ZodNativeEnum<EnumLike> => {
  const { required, type } = fieldErrs;
  return z.nativeEnum(enums, {
    ...(required && { required_error: required }),
    ...(type && { invalid_type_error: type }),
  });
};
