const yup = require("yup");

// Validation schema using Yup
const customerSchema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  // email: yup.string().email().required(),
  // password: yup.string().required().min(8),
  // mobile: yup
  //   .string()
  //   // .matches(/^[+]\d{1,3}[-.\s]?\d{1,14}$/, "Invalid phone number")
  //   .min(10, "Mobile number must be at least 10 digit"),
 });

// Validation middleware
export const validateCustomer = (req, res, next) => {
  const Data = req.body; // Assuming the request body contains user data

  customerSchema
    .validate(Data)
    .then(() => {
      // Validation successful, proceed to the next middleware or route handler
      next();
    })
    .catch((error) => {
      // Validation failed, respond with error details
      res.status(400).json({ error: error.message });
    });
};
