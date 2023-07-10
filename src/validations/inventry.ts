const yup = require("yup");
// Validation schema using Yup
export const inventrySchema = yup.object().shape({
 invoiceNo: yup.string().required("Invoice Number is Required"),        
  // serialNumber: yup.string().required("Serial Number is Required"),
  serialNumber: yup.array().of(yup.string()).required("Serial Numbers are Required"),        
  brandId: yup.string().required("brandId is Required"),
  localVendorId: yup.string().required("localVendorId is Required"),
  purchaseDate: yup.date("PurchaseDate Must be Date Formet"),
});
