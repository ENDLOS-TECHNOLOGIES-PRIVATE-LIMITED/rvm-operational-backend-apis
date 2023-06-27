const yup = require("yup");
import utility from '../utility';
import enums from '../json/enum.json'

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
