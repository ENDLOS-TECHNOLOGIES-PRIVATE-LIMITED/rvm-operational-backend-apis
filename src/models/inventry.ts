import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const inventrySchema = new Schema(
  {
    invoiceNo:{type: String, required: true, },
    invoiceDate: { type: Date ,required: true},
    resellerId: {type: mongoose.Schema.Types.ObjectId, refPath: "resellerRef"},
    brandId: {type: mongoose.Schema.Types.ObjectId, refPath: "inventryBrandRef" ,required: true},
    localVendorId: {type: mongoose.Schema.Types.ObjectId, refPath: "localVendorRef",required: true },
    machineId: {type: mongoose.Schema.Types.ObjectId, refPath: "machineRef"},
    serialNumber: { type: String, required: true, unique: true },
    purchaseRate: { type: String, required: true },
    warrantyStart:{type:Date},
    purchaseDate: { type: Date ,required: true},
    warrantyExpire: { type: Date },
    isDeleted: { type: Boolean, default: false },
    status :{type:String, enum:['InHouse','Reseller','Machine','Out Of Life'],default:'InHouse'},
    resellerWarrantyStart: {  type: Date, },
    resellerWarrantyExpire: {  type: Date  },
    isDisabled:{type:Boolean,default:false},
    replacement:{type: mongoose.Schema.Types.ObjectId}

  
  }
,

  {
    timestamps: true,
  }
);


const Invetry = model("Invetry", inventrySchema);
export default Invetry;



