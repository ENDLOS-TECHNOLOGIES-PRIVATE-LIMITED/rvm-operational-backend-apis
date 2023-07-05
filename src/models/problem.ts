import mongoose from 'mongoose';

import { Schema, model } from "mongoose";
const problemSchema = new Schema(
  {

    problemType: { type: mongoose.Schema.Types.ObjectId, refPath: "inventryTypeRef"},
    category: {
      type: String,
      enum: ["Hardware", "Plc", "Software", "Other"],
      required: true,
    },

    name: { type: String, required: true}, 
    description: { type: String, required: true },
    
},
  {
    timestamps: true,
  }
);


const Problem = model("Problem", problemSchema);
export default Problem;