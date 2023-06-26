import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const inventryBrandSchema = new Schema(
  {
    inventryTypeId:{ type: mongoose.Schema.Types.ObjectId, refPath: "inventryTypeRef", required: true },
    name: { type: String, required: true },
}
,
  {
    timestamps: true,
  }
);


const InvetryBrand = model("InvetryBrand", inventryBrandSchema);
export default InvetryBrand;



