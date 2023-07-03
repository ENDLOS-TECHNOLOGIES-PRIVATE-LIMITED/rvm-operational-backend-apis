import mongoose from 'mongoose';

import { Schema, model } from "mongoose";
const userRoleSchema = new Schema(
  {
    roleName: { type: String, required: true ,unique:true},
    description: { type: String, required: true },
    permission:[{
      moduleId:{type: mongoose.Schema.Types.ObjectId},
      permissions:{type: mongoose.Schema.Types.ObjectId},
    }],
    isActive: { type: Boolean, default: true },
  
  },
  {
    timestamps: true,
  }
);





const UserRole = model("UserRole", userRoleSchema);
export default UserRole;