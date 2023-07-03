import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const allModulesSchema = new Schema(
  {
    name: { type: String, required: true },
    collectionName: { type: String, required: true },
    description: { type: String, required: true },
    },
  {
    timestamps: true,
  }
);

const AllModules = model("AllModules", allModulesSchema);
export default AllModules;
