

const yup = require("yup");
// Validation schema using yup
export const localVendorValidationSchema = yup.object({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    contact: yup.string(),
    isDeleted: yup.boolean(),
  });