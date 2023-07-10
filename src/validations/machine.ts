const yup = require("yup");
import utility from '../utility';
import enums from '../json/enum.json'
import mongoose from 'mongoose';

// Step 2: Define the validation schema using Yup
export const machineSchema = yup.object().shape({
  machineId: yup.string().required().max(16),
  warrentyStartDate: yup.date().typeError('Warranty Start Date must be a valid date'),

  inventry: yup.array().of(
    yup.object().shape({
      // _inventry: yup.mixed().required(),
      
      _inventry: yup.mixed().test('is-mongoose-object', '_inventry Invalid Id', value => {

        // if (value === null) {
        //   return true; // Allow null values
        // }

        return mongoose.Types.ObjectId.isValid(value);
      }),
      warrantyStart: yup.date().typeError('Inventry Warranty Start Date must be a valid date'),
      warrantyExpire: yup.date().typeError('Inventry Warranty Expire Date must be a valid date'),
    })

  ),
});



// Validation middleware
export const validateMachine = (req, res, next) => {
  const userData = req.body; // Assuming the request body contains user data

  machineSchema
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