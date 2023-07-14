const yup = require("yup");
// Validation schema using Yup
export const vendorSchema = yup.object().shape({
  name: yup
  .string()
  .required("Name is required")
  .min(3, "Please enter a valid name")
  .trim(),
  email: yup.string().email().required("email is Required"),

});

