// WE Already Created Vendor Section Which is Reseller Section Now Now we Are Refrensing Vendor to LocalVendor
import { Schema, model } from "mongoose";

const localVendorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true ,unique:true},
    contact: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const LocalVendor = model("LocalVendor", localVendorSchema);
export default LocalVendor;
