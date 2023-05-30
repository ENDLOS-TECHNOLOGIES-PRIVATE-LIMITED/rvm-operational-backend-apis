const yup = require("yup");

// Validation schema using Yup
const inventrySchema = yup.object().shape({
  inventryType: yup.string().required(),
  brandName: yup.string().required(),
  serialNumber: yup.string().required(),        
  purchaseDate: yup.date(),
});
// Validation schema using Yup
const assignInventrySchema = yup.object().shape({
  inventryId: yup.string().required(),
  machineId: yup.string().required(),
});






// Validation middleware
export const validateInventry = (req, res, next) => {
  const userData = req.body; // Assuming the request body contains user data

inventrySchema
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
// Validation middleware
export const validateAssignInventry = (req, res, next) => {
  const userData = req.body; // Assuming the request body contains user data

assignInventrySchema
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
