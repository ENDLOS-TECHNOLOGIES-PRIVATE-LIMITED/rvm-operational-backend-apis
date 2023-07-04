const yup = require("yup");
// Validation schema using Yup
export const inventryBrandSchema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  inventryTypeId: yup.string().required("inventryType is Required"),

});

