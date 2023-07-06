const mongoose = require("mongoose");
import { Schema, model } from "mongoose";
const ticketSchema = new Schema(
  {
        ticketNo: { type: Number, unique: true },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
        branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
        machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine", required: true },
        category: { type: String, enum: ["Hardware", "Plc", "Software", "Other"], required: true },
        inventoryType: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryType", required: true },
        problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", },
        otherProblem:{type:String,},
        status: {
            priority: {
                type: String,
                enum: ["High", "Medium", "Low"],
                default: "Medium",
              },
          
            status: { type: String,enum: ["Pending", "Assigned", "Resolved"],default:"Pending" },
           
          },


        comment: { type: String },

        conclusion: { type: String },

        },
  {
    timestamps: true,
  }
);


// Define a function to generate the next ticket number
async function getNextTicketNumber() {
  const maxTicket = await Ticket.findOne().sort({ ticketNo: -1 }).select('ticketNo').lean();
  const nextTicketNo = maxTicket ? maxTicket.ticketNo + 1 : 1;
  return nextTicketNo;
}


// Pre-save hook to generate the ticket number if not provided
ticketSchema.pre('save', async function (next) {
if (!this.ticketNo) {
    this.ticketNo = await getNextTicketNumber();
  }
  // next();
});
const Ticket = model("Ticket", ticketSchema);
export default Ticket;