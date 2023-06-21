const yup = require("yup");

// Validation schema using Yup
const problemSchema = yup.object().shape({
    problemType: yup.string().required("Please Select the problem Type"),
    name: yup.string().required("name is required"),
    description: yup.string().required("Description is required"),        

});






// Validation middleware
export const validateProblem = (req, res, next) => {
  const userData = req.body; // Assuming the request body contains user data

  problemSchema
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
