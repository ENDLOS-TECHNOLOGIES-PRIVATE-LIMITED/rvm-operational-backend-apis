const yup = require("yup");

// Validation schema using Yup
const vendorSchema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  email: yup.string().email().required("email is Required"),

});

// Validation middleware
export const validateVendor = (req, res, next) => {
  const Data = req.body; // Assuming the request body contains user data

  vendorSchema
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
