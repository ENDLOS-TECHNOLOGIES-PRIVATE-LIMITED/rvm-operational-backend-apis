import * as Yup from "yup";

export const ticketSchema = Yup.object().shape({

  vendor: Yup.string(),
  customer: Yup.string(),
  branch: Yup.string(),
  machine: Yup.string().required("Machine is required"),
  category: Yup.string().oneOf(["Hardware", "Plc", "Software", "Other"]).required("Category is required"),
  inventoryType: Yup.string().required("Inventory type is required"),
  problemId: Yup.string(),
  otherProblem: Yup.string(),
  status: Yup.object().shape({
    priority: Yup.string().oneOf(["High", "Medium", "Low"]).default("Medium"),
    status: Yup.string().oneOf(["Pending", "Assigned", "Resolved"]).default("Pending"),
  }),
  comment: Yup.string(),
  conclusion: Yup.string(),
});

 
