import { Schema, model } from "mongoose";
const solutionSchema = new Schema(
  {

    problemId: { type: Schema.Types.ObjectId, ref: 'Problem',require:true },
    description: String,
    images: [String],
    // checked: { type: Boolean, default: false }

},
  {


    timestamps: true,

  }
);


const Solution = model("Solution", solutionSchema);
export default Solution;