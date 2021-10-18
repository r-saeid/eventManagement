import mongoose from "mongoose";
import User from "../user/model";

export interface IEvent {
  _id: mongoose.Types.ObjectId;
  name: string;
  location: string;
  startDate: number;
  endDate: number;
  createdBy: mongoose.Types.ObjectId;
  registeredUsers: [mongoose.Types.ObjectId];
  status: string;
}

export const eventSchema = new mongoose.Schema<IEvent>({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  location: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  registeredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: { type: String, default: "open" },
});

const Event = mongoose.model<IEvent>("Event", eventSchema);
export default Event;
