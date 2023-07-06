import { Schema, model } from "mongoose";
const solutionSchema = new Schema(
  {

    problemId: { type: Schema.Types.ObjectId, ref: 'Problem',require:true },
    solution:[
      {
        step:{type:Number,require:true},
        description:{type:String,require:true},
        image:{type:String,require:true},
      }
    ]
    // checked: { type: Boolean, default: false }

},
  {


    timestamps: true,

  }
);


const Solution = model("Solution", solutionSchema);
export default Solution;