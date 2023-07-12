const yup = require('yup');

export const stockSchema = yup.object().shape({
  invoiceNo: yup.string().required("Invoice Number is required"),
  invoiceDate: yup.date().required("Invoice Date is required"),
  localVendorId: yup.string().required("LocalVendor is required"),
  inventry: yup
    .array()
    .of(
      yup.object().shape({
        brandId: yup.string().required("BrandId is required"),
        warrantyStart: yup.date().typeError('Warranty Start Date must be a valid date'),
        purchaseDate: yup.date().required("PurchaseDate is required"),
        warrantyExpire: yup.date().typeError('Warranty Expire Date must be a valid date'),
        serialNumber: yup.array().of(yup.string()).required("Serial Number is required"),
        purchaseRate: yup.number().required("Purchase Rate is required"),
      })
    )
    .required("Inventry is required ! pls add Atleast One Inventry"),
});
