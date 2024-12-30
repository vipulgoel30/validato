// Third party imports
import { HydratedDocument, Schema, Types, model } from "mongoose";
import isEmail from "validator/es/lib/isEmail";
import { hash } from "bcryptjs";

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
    chancesLeft: { type: Number, required: true, min: 0, max: 5 },
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
    chancesLeft: { type: Number, required: true, min: 0, max: 3 },
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
  logins: {
    [key: string]: {
      lastActiveAt: Date;
      location: { name: string; type: string; coordinates: number[] };
    };
  };
}

const { name: nameErr, email: emailErr, password: passwordErr } = userErr;

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
      trim: true,
    },

    isVerified: { type: Boolean, default: false },
    passwordLastResetAt: { type: Date, default: () => Date.now() - 2000 },

    verify: verifySchema,
    reset: resetSchema,
    // {brandId : {lastActiveAt : Date, location: {name : "Unknown Device", type : "Point", coordinates : [10, 20]}}}
    logins: {
      type: Map,
      of: {
        lastActiveAt: { type: Date, default: () => Date.now() },
        location: {
          name: { type: String, default: "Unknown Device" },
          type: { type: String, enum: ["Point"] },
          coordinates: [Number],
        },
      },
    },
  },
  {
    timestamps: { createdAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await hash(this.password, 12);
  }
  next();
});

userSchema.virtual("brands", {
  ref: "brands",
  localField: "_id",
  foreignField: "user",
});

const User = model("users", userSchema);

export type UserD = HydratedDocument<UserI>;

export default User;
