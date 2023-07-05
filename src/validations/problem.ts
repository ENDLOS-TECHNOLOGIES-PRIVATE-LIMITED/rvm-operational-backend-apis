const yup = require("yup");

// Validation schema using Yup
export const problemSchema = yup.object().shape({
    problemType: yup.string(),
    name: yup.string().required("Problem Name is required"),
    description: yup.string().required("Description is required"),
    category: yup.string()
    .oneOf(["Hardware", "Plc", "Software", "Other"], "Invalid category type")
    .required("Category is required"),
    
});


