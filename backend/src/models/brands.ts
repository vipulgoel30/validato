// Third party imports
import { HydratedDocument, Schema, Types, model } from "mongoose";

// User imports
import { brandErr } from "@mono/utils";

interface BrandI {
  _id: Types.ObjectId;
  name: string;
  user: Types.ObjectId;
  logoUrl: string;
  address: string;
}

const { name: nameErr } = brandErr;

const brandSchema = new Schema<BrandI>(
  {
    name: {
      type: String,
      required: [true, nameErr.required!],
      minLength: [nameErr.minLength!.length, nameErr.minLength!.msg],
      maxLength: [nameErr.maxLength!.length, nameErr.maxLength!.msg],
      trim: true,
    },
    user: {
      type: Schema.ObjectId,
      required: [true, "The brand must be linked to a user."],
    },

    logoUrl: String,
    address: String,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Brand = model<BrandI>("brands", brandSchema);

export type BrandD = HydratedDocument<BrandI>;

export default Brand;
