import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const machineSchema = new Schema(
  {
    machineId: { type: String, required: true, unique: true },
    warrentyStartDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    branchId: {type: mongoose.Schema.Types.ObjectId},
    inventry: [
      {
        _inventry: { type: mongoose.Schema.Types.ObjectId,},
        warrantyStart: {  type: Date, },
        warrantyExpire: {  type: Date  },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Machine = model("Machine", machineSchema);
export default Machine;
