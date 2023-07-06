const yup = require("yup");
// Validation schema using Yup
export const customerSchema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  vendorId: yup.string().required("VendorId is Required"),

 });
