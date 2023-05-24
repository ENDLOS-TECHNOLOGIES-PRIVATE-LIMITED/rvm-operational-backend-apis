const yup = require("yup");

// Validation schema using Yup
const userSchema = yup.object().shape({
  firstname: yup.string().required().min(2).max(50),
  lastname: yup.string().required().min(2).max(50),
  email: yup.string().email().required(),
  age: yup.number().positive().integer().min(1).max(120),
  password: yup.string().required().min(8),
  role: yup.string().oneOf(["admin", "superadmin"]).required(),
  mobile: yup
    .string()
    // .matches(/^[+]\d{1,3}[-.\s]?\d{1,14}$/, "Invalid phone number")
    .min(10,"Mobile number must be at least 10 digit")
    .required("Mobile number is required"),
});


const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email and password required"),
  password: yup.string().required("Email and password required"),
});


// Validation middleware
export const  validateRegisterUser =(req, res, next)=> {
  const userData = req.body; // Assuming the request body contains user data

  userSchema
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
// Validation middleware
export const  validateLoginUser =(req, res, next)=> {
  const userData = req.body; // Assuming the request body contains user data

  loginSchema
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
