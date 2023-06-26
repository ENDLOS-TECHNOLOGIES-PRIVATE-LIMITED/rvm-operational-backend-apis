import { Schema, model } from "mongoose";
const vendorSchema = new Schema(
  {

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    
  }
,
  {
    timestamps: true,
  }
);


const Vendor = model("Vendor", vendorSchema);
export default Vendor;



