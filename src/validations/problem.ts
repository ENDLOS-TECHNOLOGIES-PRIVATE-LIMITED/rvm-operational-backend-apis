const yup = require("yup");

// Validation schema using Yup
export const problemSchema = yup.object().shape({
    problemType: yup.string().required("Please Select the problem Type"),
    name: yup.string().required("name is required"),
    description: yup.string().required("Description is required"),        

});


