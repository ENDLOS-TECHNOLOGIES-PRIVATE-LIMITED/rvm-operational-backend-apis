import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const inventrySchema = new Schema(
  {
    brandId: {type: mongoose.Schema.Types.ObjectId, refPath: "inventryBrandRef",require:true },
    serialNumber: { type: String, required: true, unique: true },
    purchaseDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
  
  }
,
  {
    timestamps: true,
  }
);


const Invetry = model("Invetry", inventrySchema);
export default Invetry;



