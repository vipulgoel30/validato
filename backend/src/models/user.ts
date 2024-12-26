// Third party imports
import { HydratedDocument, Schema, Types, model } from "mongoose";
import isEmail from "validator/es/lib/isEmail";

// User imports
import { userErr } from "@mono/utils";

export interface VerifyI {
  token: string;
  expiresAt: Date;
  chancesLeft: number;
}

const verifySchema = new Schema<VerifyI>(
  {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    chancesLeft: { type: Number, required: true },
  },
  { _id: false }
);

export interface ResetI {
  otp: string;
  expiresAt: Date;
  chancesLeft: number;
}

const resetSchema = new Schema<ResetI>(
  {
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    chancesLeft: { type: Number, required: true },
  },
  { _id: false }
);

interface UserI {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  passwordLastResetAt: Date;
  verify: VerifyI;
  reset: ResetI;
  createdAt: string;
}

const { nameErr, emailErr, passwordErr } = userErr;

const userSchema = new Schema<UserI>(
  {
    name: {
      type: String,
      required: [true, nameErr.required!],
      minLength: [nameErr.minLength!.length, nameErr.minLength!.msg],
      maxLength: [nameErr.maxLength!.length, nameErr.maxLength!.msg],
      trim: true,
    },

    email: {
      type: String,
      required: [true, emailErr.required!],
      validate: [isEmail, emailErr.format!],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, passwordErr.required!],
      minLength: [passwordErr.minLength!.length, passwordErr.minLength!.msg],
      maxLength: [passwordErr.maxLength!.length, passwordErr.maxLength!.msg],
      trim: true,
    },

    isVerified: { type: Boolean, default: false },
    passwordLastResetAt: { type: Date, default: () => Date.now() - 2000 },

    verify: verifySchema,
    reset: resetSchema,
  },
  {
    timestamps: { createdAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = model("users", userSchema);

export type UserD = HydratedDocument<UserI>;

export default User;
