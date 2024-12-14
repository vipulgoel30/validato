// Third party imports
import { HydratedDocument, Schema, model } from "mongoose";

interface UserI {
  email: string;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, ""],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true },
  }
);

const User = model("users", userSchema);

export type UserD = HydratedDocument<UserI>;

export default User;
