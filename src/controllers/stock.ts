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
          // isDeleted: false,
        },
      },
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

      // {
      //   $lookup: {
      //     from: "machines",
      //     localField: "_id",
      //     foreignField: "inventry._inventry",
      //     as: "assignedMachines",
      //   },
      // },
      // {
      //   $match: {
      //     assignedMachines: { $size: 0 },
      //   },
      // },
      
      // {
      //   $project: {
      //     _id: 1,
      //     inventryType: 1,
      //     brandName: 1,
      //     serialNumber: 1,
      //     isDeleted: 1,
      //     createdAt: 1,
      //     updatedAt: 1,
      //     __v: 1,
      //   },
      // },
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


