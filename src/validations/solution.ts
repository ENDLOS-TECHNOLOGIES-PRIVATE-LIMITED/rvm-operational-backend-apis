const yup = require("yup");

// Define the Solution schema validation schema using Yup
const solutionValidationSchema = yup.object().shape({
    problemId: yup.string().required('Problem ID is required'),
    description: yup.string().required('Description is required'),
    images: yup.array().of(yup.string().url('Invalid image URL')),
    // checked: yup.boolean().default(false)
  });



// Validation middleware
export const validateSolution = (req, res, next) => {
  const userData = req.body; // Assuming the request body contains user data

  solutionValidationSchema
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
