const yup = require("yup");

// Validation schema using Yup
const inventryTypeSchema = yup.object().shape({
  name: yup.string().required("InventryType Name is Required"),

});

// Validation middleware
export const validateInventryType = (req, res, next) => {
  const Data = req.body; // Assuming the request body contains user data

  inventryTypeSchema
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
