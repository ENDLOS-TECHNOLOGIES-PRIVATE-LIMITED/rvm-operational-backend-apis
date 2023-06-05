import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const inventryTypeSchema = new Schema(
  {
    name: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },

  },
  {
    timestamps: true,
  }
);

const InvetryType = model("InvetryType", inventryTypeSchema);
export default InvetryType;

