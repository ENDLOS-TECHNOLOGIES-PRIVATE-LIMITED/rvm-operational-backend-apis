const yup = require("yup");
import utility from '../utility';
import enums from '../json/enum.json'

// Validation schema using Yup
const customerSchema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  vendorId: yup.string().required("VendorId is Required"),

 });

// Validation middleware
export const validateCustomer = (req, res, next) => {
  const Data = req.body; // Assuming the request body contains user data

  customerSchema
    .validate(Data)
    .then(() => {
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
