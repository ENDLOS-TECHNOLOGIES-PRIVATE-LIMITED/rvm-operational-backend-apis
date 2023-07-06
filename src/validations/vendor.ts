const yup = require("yup");
import utility from '../utility';
import enums from '../json/enum.json'

// Validation schema using Yup
export const vendorSchema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  email: yup.string().email().required("email is Required"),

});

