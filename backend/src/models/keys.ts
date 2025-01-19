// Third party imports
import { HydratedDocument, Schema, Types, model } from "mongoose";

// User imports
import { keyErr, KeyStatus } from "@mono/utils";

interface CountI {
  validate: number;
  authorize: number;
}

interface KeyI {
  _id: Types.ObjectId;
  brand: Types.ObjectId;
  status: string;
  limits?: CountI;
  usage: CountI;
}

const { status: statusErr } = keyErr;

const keySchema = new Schema<KeyI>({
  brand: {
    type: Schema.ObjectId,
    required: [true, "The key must be linked to a brand."],
  },
  status: {
    type: String,
    required: [true, statusErr.required!],
    enums: {
      values: Object.values(KeyStatus),
      message: statusErr.format!,
    },
    default:KeyStatus.active
  },

  limits: {
    validate: { type: Number, min: 0 },
    authorize: { type: Number, min: 0 },
  },

  usage: {
    validate: { type: Number, min: 0, default: 0 },
    authorize: { type: Number, min: 0, default: 0 },
  },
});

// keySchema.pre("save", function (next) {
//   this.usage.validate = 0;
//   this.usage.authorize = 0;
//   next();
// });

const Keys = model<KeyI>("keys", keySchema);

export type KeyD = HydratedDocument<KeyI>;

export default Keys;
