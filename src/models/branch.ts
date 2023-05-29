import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const branchSchema = new Schema(
  {
    name: { type: String, required: true },
    customer: {
      _customerId: { type: mongoose.Schema.Types.ObjectId, refPath: "customerRef", required: true },
      date: { type: Date, default: Date.now() },
    },
    isDeleted:{
      type:Boolean,
      default:false
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
    createdBy: {
      _user: { type: mongoose.Schema.Types.ObjectId, refPath: "userRef" },
      date: { type: Date, default: Date.now() },
    },
  },
  {
    timestamps: true,
  }
);

const Branch = model("Branch", branchSchema);
export default Branch;
