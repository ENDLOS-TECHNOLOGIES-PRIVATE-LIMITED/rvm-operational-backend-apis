const yup = require("yup");

// Validation schema using Yup
const userRoleSchema = yup.object().shape({
  roleName: yup.string().required().min(2).max(50),
  description: yup.string().required().min(2).max(50),
  
});



// Validation middleware
export const  validateUserRole =(req, res, next)=> {
  const userData = req.body; // Assuming the request body contains user data

  userRoleSchema
    .validate(userData)
    .then(() => {
      // Validation successful, proceed to the next middleware or route handler
      next();
    })
    .catch((error) => {
      // Validation failed, respond with error details
      res.status(400).json({ error: error.message });
    });
}
