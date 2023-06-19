import mongoose from 'mongoose';

import { Schema, model } from "mongoose";
const userRoleSchema = new Schema(
  {
    roleName: { type: String, required: true ,unique:true},
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  
  },
  {
    timestamps: true,
  }
);


const UserRole = model("UserRole", userRoleSchema);
export default UserRole;