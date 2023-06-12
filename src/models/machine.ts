import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const machineSchema = new Schema(
  {
    machineId: { type: String, required: true, unique: true },
    // customerName: { type: String },
    // serialNumber: { type: String, required: true, unique: true },
    warrentyStartDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    // branch: {
    //   _branchId: { type: mongoose.Schema.Types.ObjectId},
    //   date: { type: Date },
    // },

    branchId: {type: mongoose.Schema.Types.ObjectId},
    inventry: [
      {
        _inventry: { type: mongoose.Schema.Types.ObjectId, default: null },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Machine = model("Machine", machineSchema);
export default Machine;
