import mongoose from "mongoose";

const yup = require("yup");
// Validation schema using Yup
export const inventrySchema = yup.object().shape({
 invoiceNo: yup.string().required("Invoice Number is Required"),   
 invoiceDate: yup.date().required("Invoice Date is required"),     
 serialNumber: yup.array().of(yup.string()).required("Serial Number are Required"),        
  localVendorId: yup.string().required("localVendorId is Required"),
  resellerId: yup.string().test('valid-resellerId', 'Invalid resellerId', (value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }),
  brandId: yup.string().test('valid-brandId', 'Invalid brandId', (value) => {
    return mongoose.Types.ObjectId.isValid(value);
  }).required("BrandId is required"),
  purchaseDate: yup.date("PurchaseDate Must be Date Formet").required("PurchaseDate is required"),
  purchaseRate: yup.string().required("purchaseRate is required"),
});
