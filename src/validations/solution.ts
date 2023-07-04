const yup = require("yup");

// Define the Solution schema validation schema using yup
export const solutionSchema = yup.object().shape({


  problemId: yup.string().required('Problem ID is required'),
  solution: yup.array().of(
    yup.object().shape({
      step: yup.number().required('Step is required'),
      description: yup.string().required('Description is required'),
      image: yup.string().required('Image is required'),
    })
  )
  });

