import { EnumLike } from "zod";
export interface FieldErrMsg {
    required?: string;
    minLength?: {
        length: number;
        msg: string;
    };
    maxLength?: {
        length: number;
        msg: string;
    };
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
declare const createFieldErrMsg: ({ field, required, minLength, maxLength, expectedType, enums, }: CreateFieldErrMsgOptions) => FieldErrMsg;
export default createFieldErrMsg;
