import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const customerSchema = new Schema(
  {
    name: { type: String, required: true },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      _user: { type: mongoose.Schema.Types.ObjectId, refPath: "userRef" },
    },
    editedBy: [
      {
        _user: { type: mongoose.Schema.Types.ObjectId, refPath: "userRef" },
        date: { type: Date },
      },
    ],
    // deletedBy: [
    //   {
    //     _user: { type: mongoose.Schema.Types.ObjectId, refPath: "userRef" },
    //     date: { type: Date },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);


const Customer = model("Customer", customerSchema);
export default Customer;
