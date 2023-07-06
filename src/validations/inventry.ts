const yup = require("yup");
// Validation schema using Yup
export const inventrySchema = yup.object().shape({
 invoiceNo: yup.string().required("Invoice Number is Required"),        
  serialNumber: yup.string().required("Serial Number is Required"),        
  brandId: yup.string(),
  purchaseDate: yup.date("PurchaseDate Must be Date Formet"),
});
