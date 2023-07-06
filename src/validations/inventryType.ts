const yup = require("yup");


// Validation schema using Yup
export const inventryTypeSchema = yup.object().shape({
  name: yup.string().required("InventryType Name is Required"),

});

