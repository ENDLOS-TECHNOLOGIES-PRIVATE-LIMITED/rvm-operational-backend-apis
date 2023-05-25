import mongoose from "mongoose";

import { Schema, model } from "mongoose";
const inventrySchema = new Schema(
  {
    name: { type: String, required: true },
    brandName: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    purchaseDate: { type: Date, default: Date.now() },
    isDeleted: { type: Boolean, default: false },
    assignedTo: {
      _machine: { type: mongoose.Schema.Types.ObjectId, refPath: "machineRef" },
      date: { type: Date },
    },
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


//  export const Invetry =()=> {
//   return mongoose.model(`Inventry`, inventrySchema);
// }


// const InvetryModel = mongoose.model("Inventry", inventrySchema);

// module.exports = InvetryModel;