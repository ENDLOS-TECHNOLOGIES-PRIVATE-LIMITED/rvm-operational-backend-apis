const yup = require("yup");
import utility from '../utility';
import enums from '../json/enum.json'
import mongoose from 'mongoose';

// Step 2: Define the validation schema using Yup
export const machineSchema = yup.object().shape({
  machineId: yup.string().required().min(16).max(16),
  // resellerId: yup
  //   .string()
  //   .when('$resellerIdAvailable', {
  //     is: true,
  //     then: yup
  //       .string()
  //       .test('is-mongoose-object', 'Invalid resellerId', value => {
  //         return mongoose.Types.ObjectId.isValid(value);
  //       }),
  //   }),
  customerId: yup
    .string()
    .when('$customerIdAvailable', {
      is: true,
      then: yup
        .string()
        .test('is-mongoose-object', 'Invalid customerId', value => {
          return mongoose.Types.ObjectId.isValid(value);
        }),
    }),
  branchId: yup
    .string()
    .when('$branchIdAvailable', {
      is: true,
      then: yup
        .string()
        .test('is-mongoose-object', 'Invalid branchId', value => {
          return mongoose.Types.ObjectId.isValid(value);
        }),
    }),
    resellerId: yup.string().required("ResellerId is required"),

  // resellerId: yup.string().test('is-mongoose-object', 'Invalid resellerId', value => {
  //     return mongoose.Types.ObjectId.isValid(value);
  // }),
  // customerId: yup.string().test('is-mongoose-object', 'Invalid customerId', value => {
  //     return mongoose.Types.ObjectId.isValid(value);
  // }),
  // branchId: yup.string().test('is-mongoose-object', 'Invalid branchId', value => {
  //     return mongoose.Types.ObjectId.isValid(value);
  // }),

  
   inventry: yup.array().of(
    yup.object().shape({
    
      _inventry: yup.mixed().test('is-mongoose-object', '_inventry Invalid Id', value => {
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