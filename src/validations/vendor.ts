const yup = require("yup");
import utility from '../utility';
import enums from '../json/enum.json'

// Validation schema using Yup
const vendorSchema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  email: yup.string().email().required("email is Required"),

});

// Validation middleware
export const validateVendor = (req, res, next) => {
  const Data = req.body; // Assuming the request body contains user data

  vendorSchema
    .validate(Data)
    .then(() => {
      // Validation successful, proceed to the next middleware or route handler
      next();
    })
    .catch((error) => {



      const responseCatchError = {
        req: req,
        result: -1,
        message: error.message,
        payload: {},
        logPayload: false,
      };
      
     return res.status(enums.HTTP_CODES.BAD_REQUEST)
         .json(utility.createResponseObject(responseCatchError));

      
    });
};
