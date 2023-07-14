const yup = require("yup");
// Validation schema using yup
// export const localVendorValidationSchema = yup.object({
//     name: yup.string().required("Name is required").min(3,"Pls enter a valid name"),
//     email: yup.string().email("Invalid email").required("Email is required"),
//     contact: yup.string().min(10,'Please enter a valid contact Number'),
//     isDeleted: yup.boolean(),
//   });



  export const localVendorValidationSchema = yup.object({
    name: yup
      .string()
      .required("Name is required")
      .min(3, "Please enter a valid name")
      .trim(),
    email: yup.string().email("Invalid email").required("Email is required"),
    contact: yup.string().trim().min(10, 'Please enter a valid contact number'),
    isDeleted: yup.boolean(),
  });
  