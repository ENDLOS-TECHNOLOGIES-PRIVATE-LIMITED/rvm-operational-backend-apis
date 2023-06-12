const yup = require("yup");

// Step 2: Define the validation schema using Yup
const machineSchema = yup.object().shape({
  machineId: yup.string().required().max(16),
  // customerName: yup.string(),
//   serialNumber: yup.string().required(),
  warrentyStartDate: yup.date(),
  inventry: yup.array().of(
    yup.object().shape({
      _inventry: yup.string().required(),
    })
  ),
});



// Validation middleware
export const validateMachine = (req, res, next) => {
  const userData = req.body; // Assuming the request body contains user data

  machineSchema
    .validate(userData)
    .then(() => {
      // Validation successful, proceed to the next middleware or route handler
      next();
    })
    .catch((error) => {
      // Validation failed, respond with error details
      res.status(400).json({ error: error.message });
    });
};