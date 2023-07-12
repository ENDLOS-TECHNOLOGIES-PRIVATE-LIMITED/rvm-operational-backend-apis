              import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const machineSchema = new Schema(
  {
    machineId: { type: String, required: true, unique: true },
    warrentyStart: { type: Date },
    warrentyExpire:{type:Date},
    isDeleted: { type: Boolean, default: false },
    branchId: {type: mongoose.Schema.Types.ObjectId},
    resellerId: {type: mongoose.Schema.Types.ObjectId,required:true},
    customerId: {type: mongoose.Schema.Types.ObjectId},
    // inventry: [
    //   {
    //     _inventry: { type: mongoose.Schema.Types.ObjectId,},
    //     resellerWarrantyStart: {  type: Date, },
    //     resellerWarrantyExpire: {  type: Date  },
    //     isDisabled:{type:Boolean},
    //     replacement:{type: mongoose.Schema.Types.ObjectId}
    //   },
    // ],
    // Frezed:{
    //   isFrezed:{type:Boolean,default:false},
    //   date:{type:Date,}
    // }
  },
  {
    timestamps: true,
  }
);

const Machine = model("Machine", machineSchema);
export default Machine;
