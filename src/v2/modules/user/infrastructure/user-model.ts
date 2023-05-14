import { model, Schema } from "mongoose";
import { UserModel } from "../domain/user-repository";

const UserSchema = new Schema<UserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

const userModel = model("users", UserSchema);

export default userModel;
