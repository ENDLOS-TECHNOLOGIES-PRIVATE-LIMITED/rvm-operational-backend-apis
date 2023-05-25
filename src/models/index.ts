
// import { readdirSync } from "fs";
// import { basename, join } from "path";
// import mongoose from "mongoose";

// const models: Record<string, mongoose.Model<any>> = {};

// // Import all model files dynamically
// const modelFiles = readdirSync(__dirname)
//   .filter((file) => file !== "index.ts")
//   .forEach((file) => {
//     const modelName = basename(file, ".ts");
//     const model = require(join(__dirname, file)).default;
//     models[modelName] = model;
//   });

// export default models;





import Inventory from "./inventry";
import User from "./user";

export default {
  Inventory,
  User,
};

