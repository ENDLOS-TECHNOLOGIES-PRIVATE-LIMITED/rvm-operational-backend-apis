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



  

 
  inventoryDetails: yup.array().of(
    yup.object().shape({
    
      _id: yup.mixed().test('is-mongoose-object', 'Invalid _id', value => {
        return mongoose.Types.ObjectId.isValid(value);
      }).required("_id is requred"),
      resellerWarrantyStart: yup.date().typeError(' resellerWarrantyStart Date must be a valid date').required("resellerWarrantyStart Date is required"),
      resellerWarrantyExpire: yup.date().typeError('resellerWarrantyExpire Date must be a valid date').required("resellerWarrantyExpire Date is required"),
    })

  ),
});

// Step 2: Define the validation schema using Yup
export const assignMachineSchema = yup.object().shape({
  
  customerId: yup.string()
  
  .test('is-mongoose-object', 'Invalid customerId', value => {
            return mongoose.Types.ObjectId.isValid(value);
          })
  
  
  .required('customerId is required'),
  branchId: yup.string()
  
  .test('is-mongoose-object', 'Invalid branchId', value => {
            return mongoose.Types.ObjectId.isValid(value);
          })
  
  
  .required('branchId ID is required'),
  resellerId: yup.string()
  
  .test('is-mongoose-object', 'Invalid resellerId', value => {
            return mongoose.Types.ObjectId.isValid(value);
          })
  
  
  .required('resellerId is required'),




});


