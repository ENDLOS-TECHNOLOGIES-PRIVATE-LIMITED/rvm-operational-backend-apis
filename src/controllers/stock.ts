import { Request, Response, NextFunction } from 'express';
import models from '../models'
import helpers from "../helpers";
import mongoose, { model } from 'mongoose';
import utility from '../utility';
import enums from '../json/enum.json'
import messages from '../json/message.json'
interface AuthenticatedRequest extends Request {
  user?: {
    id:String,
    role:String
  }
}

// export const getAll = async (req: AuthenticatedRequest, res: Response) => {
//   try {

// const {id,nestedData,allData} =req.query;

// let vendors;

//     const matchStage:any = {
//       };

// // if (allData==='false'|| !allData) {
// //       matchStage.isDeleted =false;
// //     }
    

// //     if (id) {
// //       matchStage._id =  new mongoose.Types.ObjectId(id.toString());
// //     }

   
    






//        vendors = await models.vendor.aggregate([
//         { $match: matchStage}, // Filter customers with isDelete set to false
//         { $sort: { createdAt: -1 } },
//       {
//           $lookup: {
//             from: "customers",
//             let: { vendorId: "$_id" },
//             pipeline: [
//               {
//                 $match: {
//                   $expr: {
//                     $and: [
//                       { $eq: ["$vendorId", "$$vendorId"] },

                     
//               ]
//                   }
//                 }
//               }
//             ],
//             as: "customers",
//           },
//         },
        


//       ]).exec();



//       export const stock = async (req: AuthenticatedRequest, res: Response) => {
//   try {
//     let { type, id } = req.query;

//     const stock = await models.Inventory.aggregate([
//       {
//         $match: {
//           // isDeleted: false,
//         },
//       },
//       // {
//       //   $lookup: {
//       //     from: "machines",
//       //     localField: "_id",
//       //     foreignField: "inventry._inventry",
//       //     as: "machines",
//       //   },
//       // },

//       // {
//       //   $lookup: {
//       //     from: "machines",
//       //     localField: "_id",
//       //     foreignField: "inventry._inventry",
//       //     as: "assignedMachines",
//       //   },
//       // },
//       // {
//       //   $match: {
//       //     assignedMachines: { $size: 0 },
//       //   },
//       // },
      
//       // {
//       //   $project: {
//       //     _id: 1,
//       //     inventryType: 1,
//       //     brandName: 1,
//       //     serialNumber: 1,
//       //     isDeleted: 1,
//       //     createdAt: 1,
//       //     updatedAt: 1,
//       //     __v: 1,
//       //   },
//       // },
//     ]);



//     const payload = {
//       stock,
   
//     };

//     const data4createResponseObject = {
//       req: req,
//       result: 0,
//       message: "messages.INVENTORY_FETCHED",
//       payload: payload,
//       logPayload: false,
//     };
    
//    return  res.status(enums.HTTP_CODES.OK)
//        .json(utility.createResponseObject(data4createResponseObject));



    
//   } catch (error: any) {

    
//     const responseCatchError = {
//       req: req,
//       result: -1,
//       message: messages.GENERAL_EROOR,
//       payload: {},
//       logPayload: false,
//     };
    
    
//    return  res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
//       .json(utility.createResponseObject(responseCatchError));



    
//   }
// };



//       if(vendors.length==0){



//         const responseCatchError = {
//           req: req,
//           result: -1,
//           message: messages.NOT_FOUND,
//           payload: {},
//           logPayload: false,
//         };
        
        
//         return  res.status(enums.HTTP_CODES.BAD_REQUEST)
//           .json(utility.createResponseObject(responseCatchError));

      
//       }

//     let payload = {
//         vendors,
//       };
    

//     const data4createResponseObject = {
//         req: req,
//         result: 0,
//         message: "messages.STOCK_FETCHED0",
//         payload: payload,
//         logPayload: false,
    
//       };

//      return res
//         .status(enums.HTTP_CODES.OK)
//         .json(utility.createResponseObject(data4createResponseObject));



 
//   } catch (error: any) {



//     const responseCatchError = {
//         req: req,
//         result: -1,
//         message: messages.GENERAL_EROOR,
//         payload: {},
//         logPayload: false,
//       };
      
      
//    return  res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
//         .json(utility.createResponseObject(responseCatchError));

// }
// };




export const stock = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let { type, id } = req.query;

    const stock = await models.Inventory.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },

      { $sort: { createdAt: -1 } },
      // {
      //   $lookup: {
      //     from: "machines",
      //     localField: "_id",
      //     foreignField: "inventry._inventry",
      //     as: "machines",
      //   },
      // },
      {
        $lookup: {
          from: "invetrybrands",
          localField: "brandId",
          foreignField: "_id",
          as: "invetrybrands",
        },
      },
      {
        $lookup: {
          from: "invetrytypes",
          localField: "invetrybrands.inventryTypeId",
          foreignField: "_id",
          as: "invetrytypes",
        },
      },

      {
        $lookup: {
          from: "localvendors",
          localField: "localVendorId",
          foreignField: "_id",
          as: "localvendors",
        },
      },
      {
        $lookup: {
          from: "vendors",
          localField: "resellerId",
          foreignField: "_id",
          as: "reseller",
        },
      },
      {
        $lookup: {
          from: "machines",
          localField: "machineId",
          foreignField: "_id",
          as: "machines",
        },
      },

   
      {
        $group: {
          _id: '$_id',
      invoiceNo: { $first: '$invoiceNo' },
      invoiceDate: { $first: '$invoiceDate' },
      purchaseRate: { $first: '$purchaseRate' },
      serialNumber: { $first: '$serialNumber' },
      purchaseDate: { $first: '$purchaseDate' },
      warrantyExpire: { $first: '$warrantyExpire' },
      resellerWarrantyStart: { $first: '$resellerWarrantyStart' },
      resellerWarrantyExpire: { $first: '$resellerWarrantyExpire' },
      // isDisabled: { $first: '$isDisabled' },
      status: { $first: '$status' },
      

      vendor: {
      $first: { $arrayElemAt: ["$localvendors", 0] }
    },
      brandDetails: {
      $first: { $arrayElemAt: ["$invetrybrands", 0] }
    },

    invetrytypes: {
      $first: { $arrayElemAt: ["$invetrytypes", 0] }
    },
    reseller: {
      $first: { $arrayElemAt: ["$reseller", 0] }
    },



       
        },
        


      },

      {
        $project: {

          _id:"$_id",
          invoiceNo:"$invoiceNo",
          invoiceDate:"$invoiceDate",
          productSerialNumber:"$serialNumber",
          purchaseRate:"$purchaseRate",
          endlosWarrantyExpire:"$warrantyExpire",
          resellerWarrantyStart:"$resellerWarrantyStart",
          resellerWarrantyExpire:"$resellerWarrantyExpire",
          status:"$status",
          endlosPurchaseDate:"$purchaseDate",
          vendor:{
            _id:"$vendor._id",
            name:"$vendor.name"
          },
          productCategory:{
            _id:"$invetrytypes._id",
            name:"$invetrytypes.name"
          },
          productBrand:{
            _id:"$brandDetails._id",
            name:"$brandDetails.name"
          },
          reseller:{
            _id:"$reseller._id",
            name:"$reseller.name"
          },
          // isDisabled:"$isDisabled",
          // status:"Active", // need to work on status part 
          // brand:{
          //   _id:"$brand._id",
          //   name:"$brand.name"
          // },
          // invetrytypes:{
          //   _id:"$invetrytypes._id",
          //   name:"$invetrytypes.name"
          // }
    

        }
      }
    ]);



    const payload = {
      stock,
   
    };

    const data4createResponseObject = {
      req: req,
      result: 0,
      message: "messages.INVENTORY_FETCHED",
      payload: payload,
      logPayload: false,
    };
    
   return  res.status(enums.HTTP_CODES.OK)
       .json(utility.createResponseObject(data4createResponseObject));



    
  } catch (error: any) {

    
    const responseCatchError = {
      req: req,
      result: -1,
      message: messages.GENERAL_EROOR,
      payload: {},
      logPayload: false,
    };
    
    
   return  res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));



    
  }
};


export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const {invoiceNo,invoiceDate,localVendorId,inventry,other} =req.body;




const SerialNumbers = [];

const modifiedInventry = inventry.map(element=>{
  const uniqueSerialNumber = Array.from(new Set(element.serialNumber));
  SerialNumbers.push(...uniqueSerialNumber)
  element.serialNumber= uniqueSerialNumber

  return element
})

const isSerialExist = await models.Inventory.find({ serialNumber: { $in: SerialNumbers } })
 const isInvoiceExist = await models.Inventory.findOne({ invoiceNo: req.body.invoiceNo });
 

 if (isInvoiceExist) {
     
      const responseError = {
        req: req,
        result: -1,
        message: messages.INVOICE_EXIST,
        payload: {},
        logPayload: false,
      };
      
     return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseError));



    }
 if (isSerialExist.length > 0 ) {
     
      const responseError = {
        req: req,
        result: -1,
        message: messages.INVENTRY_SERIAL_EXIST,
        payload: {},
        logPayload: false,
      };
      
     return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseError));



    }


const addedInventry = await Promise.all(
      modifiedInventry.map(async (element) => {
        return Promise.all(
          element?.serialNumber.map(async (serialNumber) => {
            return await models.Inventory.create({
              invoiceNo,
              localVendorId,
              invoiceDate,
              serialNumber,
              brandId: element.brandId,
              purchaseDate: element.purchaseDate,
              warrantyExpire: element.warrantyExpire,
              purchaseRate: element.purchaseRate,
              
            });
          })
        );
      })
    );
 
 
 
 
      const payload = {
       addedInventry,
     };
   
   
   
     const data4createResponseObject = {
       req: req,
       result: 0,
       message: messages.INVENTORY_CREATED,
       payload: payload,
       logPayload: false,
     };





     return  res.status(enums.HTTP_CODES.OK)
     .json(utility.createResponseObject(data4createResponseObject));


  } catch (error: any) {


    const responseCatchError = {
      req: req,
      result: -1,
      message: messages.GENERAL_EROOR,
      payload: {},
      logPayload: false,
    };
    
    
   return  res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));



  }
};


