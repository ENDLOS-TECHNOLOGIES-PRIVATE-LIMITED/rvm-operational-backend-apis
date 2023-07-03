import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const permissionSchema = new Schema(
  {
    name: { type: String, required: true },
    collectionName: { type: String, required: true },
    description: { type: String, required: true },
    },
  {
    timestamps: true,
  }
);

const Permission = model("Permission", permissionSchema);
export default Permission;
