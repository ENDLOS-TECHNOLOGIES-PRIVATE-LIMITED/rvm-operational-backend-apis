import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const inventrySchema = new Schema(
  {
    name: { type: String, required: true },
    brandName: { type: String, required: true },
    serialNumber: { type: String, required: true },
    purchaseDate: { type: Date, required: true },
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


const Invetry = model("Invetry", inventrySchema);
export default Invetry;
