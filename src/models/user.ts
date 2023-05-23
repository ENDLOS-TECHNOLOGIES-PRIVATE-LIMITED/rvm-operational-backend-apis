import mongoose from 'mongoose';

import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    role: { type: String, enum: ["admin", "superadmin"], default: "user" },
    firstname: { type: String, required: true },
    token: { type: String },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    dob: Date,
    gender: String,
    mobile: {
      type: Number,
      unique: true,
      required: [true, "Mobile is required."],
    },
    email: String,
    // isEmailVarified: { type: Number, default: 0 },
    userImage: String,
    // coverImage: String,
    isDeleted: { type: Boolean, default: false },
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