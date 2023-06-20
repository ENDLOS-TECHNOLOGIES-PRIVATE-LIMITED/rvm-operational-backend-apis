import mongoose from 'mongoose';

import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    // role: { type: String, enum: ["admin", "superadmin"], default: "user" },
    role: { type: mongoose.Schema.Types.ObjectId, refPath: "userRoleRef" },
    name: { type: String, required: true },
    password: { type: String, required: true },
    dob: Date,
    mobile: {
      type: String,
      unique: true,
      required: [true, "Mobile is required."],
    },
    email: { type: String, required: true, unique: true },
    userImage: String,
    isActive: { type: Boolean, default: true },
    createdBy: {
      _user: { type: mongoose.Schema.Types.ObjectId, refPath: "userRef" },
      date: { type: Date, default: Date.now() },
    },
    editedBy: [
      {
        _user: { type: mongoose.Schema.Types.ObjectId, refPath: "userRef" },
        date: { type: Date },
      },
    ],
    deletedBy: [
      {
        _user: { type: mongoose.Schema.Types.ObjectId, refPath: "userRef" },
        date: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);


// export default function () {
//   return mongoose.model(`User`, userSchema);
// }

const User = model("User", userSchema);
export default User;