const yup = require("yup");

// Validation schema using Yup
export const branchSchema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  customerId: yup.string().required("customerId is Required"),

});

