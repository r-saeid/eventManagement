import mongoose from "mongoose";
import { roles } from "../utils/customeTypes";

export interface Iuser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  picture: string;
  token: string;
}

export const userSchema = new mongoose.Schema<Iuser>({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: { type: String, enum: roles },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  birthDate: { type: Date },
  picture: { type: String },
  token: { type: String },
});

const User = mongoose.model<Iuser>("User", userSchema);
export default User;
