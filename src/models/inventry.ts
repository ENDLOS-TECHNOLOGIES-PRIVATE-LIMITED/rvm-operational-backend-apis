import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const inventrySchema = new Schema(
  {
    inventryType: {type: mongoose.Schema.Types.ObjectId, refPath: "inventryRef",require:true },
    brandName: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    // purchaseDate: { type: Date, default: Date.now() },
    purchaseDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    // assignedTo: {
    //   _machine: { type: mongoose.Schema.Types.ObjectId, refPath: "machineRef" },
    //   date: { type: Date },
    // },
  }
,
  {
    timestamps: true,
  }
);


const Invetry = model("Invetry", inventrySchema);
export default Invetry;



