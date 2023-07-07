import { Request, Response, NextFunction } from "express";
import models from "../models";
import enums from '../json/enum.json'
import messages from '../json/message.json'
import utility from '../utility';


interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}


export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const {brandName,inventryTypeId,brandId,serialNumber,purchaseDate,warrantyExpired,invoiceNo} =req.body;


const uniqueSerialNumber = Array.from(new Set(serialNumber));


const isSerialExist = await models.Inventory.find({ serialNumber: { $in: uniqueSerialNumber } })





    // checking the serila number exist or not 
    // const isSerialExist = await models.Inventory.find({ serialNumber: req.body.serialNumber });
    // const isInvoiceExist = await models.Inventory.findOne({ invoiceNo: req.body.invoiceNo });//aakash & yash sir ke bole par dubara change nhi karunga

    
    // if (isInvoiceExist) {
     
    //   const responseError = {
    //     req: req,
    //     result: -1,
    //     message: messages.INVENTRY_INVOICE_EXIST,
    //     payload: {},
    //     logPayload: false,
    //   };
      
    //  return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
    //      .json(utility.createResponseObject(responseError));



    // }
    // if (isSerialExist.length > 0 ||isInvoiceExist) {
     
    //   const responseError = {
    //     req: req,
    //     result: -1,
    //     message: messages.INVENTRY_SERIAL_EXIST,
    //     payload: {},
    //     logPayload: false,
    //   };
      
    //  return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
    //      .json(utility.createResponseObject(responseError));



    // }












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




    // let addedInventry ;

    // let addedInventry= uniqueSerialNumber.map(async element=>{

    //    return await models.Inventory.create({
    //     ...req.body,
    //     });

    // })


    


    const addedInventry = await  Promise.all(
      uniqueSerialNumber.map(async (element) => {
              return await models.Inventory.create({
              serialNumber: element,
              purchaseDate,
              warrantyExpired,
              invoiceNo,
              brandId
              
         
            });

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
 

    



//     if(brandName && inventryTypeId){



//       const isBrandExist = await models.inventryBrand.findOne({name:brandName,inventryTypeId:inventryTypeId})

//       console.log({isBrandExist});



//       if(isBrandExist){
//         const responseError = {
//           req: req,
//           result: -1,
//           message: messages.BRAND_EXIST,
//           payload: {},
//           logPayload: false,
//         };
        
        
//        return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
//           .json(utility.createResponseObject(responseError));
      
//       }
      



//   const createdBrand = await models.inventryBrand.create({
//   name:brandName,
//   inventryTypeId:inventryTypeId
//     })
  
  


//     const addedInventry = await models.Inventory.create({
//       brandId:createdBrand._id,
//       ...req.body,

//       });

      
 
 
 
 
//       const payload = {
//        addedInventry,
//      };
   
   
   
//      const data4createResponseObject = {
//        req: req,
//        result: 0,
//        message: messages.INVENTORY_CREATED,
//        payload: payload,
//        logPayload: false,
//      };
     
//     return  res.status(enums.HTTP_CODES.OK)
//         .json(utility.createResponseObject(data4createResponseObject));



  
  


     

//     }else if(serialNumber&&brandId){

//     // Adding Inventry in the Db
//     const addedInventry = await models.Inventory.create({
//       ...req.body,
//       });
 
 
 
 
//       const payload = {
//        addedInventry,
//      };
   
   
   
//      const data4createResponseObject = {
//        req: req,
//        result: 0,
//        message: messages.INVENTORY_CREATED,
//        payload: payload,
//        logPayload: false,
//      };
     
//     return  res.status(enums.HTTP_CODES.OK)
//         .json(utility.createResponseObject(data4createResponseObject));
 

//     }
// else{


//   const responseError = {
//     req: req,
//     result: -1,
//     message: messages.BAD_REQUEST,
//     payload: {},
//     logPayload: false,
//   };
  
  
//  return  res.status(enums.HTTP_CODES.BAD_REQUEST)
//     .json(utility.createResponseObject(responseError));

// }
   



  } catch (error: any) {



    console.log(error);

    
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


export const get = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let { type, inventryTypeId } = req.query;
    if(type=='unassigned'){
      //chekding inventry which provided by user are assigned to another machine or not
      const unAssignedInventry = await models.Inventory.aggregate([
        {
          $match: {
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "machines",
            localField: "_id",
            foreignField: "inventry._inventry",
            as: "machines",
          },
        },
 
        {
          $lookup: {
            from: "machines",
            localField: "_id",
            foreignField: "inventry._inventry",
            as: "assignedMachines",
          },
        },
        {
          $match: {
            assignedMachines: { $size: 0 },
          },
        },
        
        {
          $project: {
            _id: 1,
            inventryType: 1,
            brandName: 1,
            serialNumber: 1,
            isDeleted: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
          },
        },
      ]);


      // const allInventry = await models.Inventory.aggregate([
      //   {
      //     $match: {
      //       isDeleted: false,
      //       assignedTo: { $exists: false },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "invetrytypes", // Replace "inventoryTypes" with the actual name of your inventory types collection
      //       localField: "inventryType",
      //       foreignField: "_id",
      //       as: "inventoryType",
      //     },
      //   },
      //   {
      //     $unwind: "$inventoryType",
      //   },
      //   {
      //     $addFields: {
      //       inventryType: "$inventoryType.name",
      //     },
      //   },
      //   {
      //     $project: {
      //       inventoryType: 0,
      //     },
      //   },
      // ]);

      const payload = {
      unAssignedInventry,
      };

      // // sending All Inventry
      // res.json({
      //   message: "Successfully get All Inventry",
      //   data: Response,
      //   success: true,
      // });


      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.INVENTORY_FETCHED,
        payload: payload,
        logPayload: false,
      };
      
     return  res.status(enums.HTTP_CODES.OK)
         .json(utility.createResponseObject(data4createResponseObject));





    }

    else if (type == "all") {
    
      const allInventry = await models.Inventory.aggregate([
        {
          $match: {
           isDeleted:false
          },
        },
        {
          $lookup: {
            from: "invetrybrands", // Replace "inventoryTypes" with the actual name of your inventory types collection
            localField: "brandId",
            foreignField: "_id",
            as: "invetrybrands",
          },
        },
        {
          $unwind: "$invetrybrands" // Unwind the invetrybrands array
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
          $addFields: {
            invetrybrand: "$invetrybrands",
            invetrytype: "$invetrytypes"
          }
        },
        {
          $project: {
            invetrybrand: {
              _id: 1,
              inventryTypeId: 1,
              name: 1
            },
            invetrytype: {
              _id: 1,
              name: 1
            },
            // Add other fields you want to include in the result
            _id: 1,
            brandId: 1,
            invoiceNo:1,
            warrantyExpired:1,
            purchaseDate:1,
            serialNumber: 1,
            isDeleted: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1
          }
        }


      ]);
 

      const payload = {
        allInventry,
     
      };

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.INVENTORY_FETCHED,
        payload: payload,
        logPayload: false,
      };
      
     return  res.status(enums.HTTP_CODES.OK)
         .json(utility.createResponseObject(data4createResponseObject));
    } 
    
    
    // else if (inventryTypeId) {
    //   const filterdInventory = await models.Inventory.aggregate([
    //     { $match: { inventryType: new mongoose.Types.ObjectId(inventryTypeId.toString()), isDeleted: false } },

    //     {
    //       $lookup: {
    //         from: "invetrytypes", // Replace "inventoryTypes" with the actual name of your inventory types collection
    //         localField: "inventryType",
    //         foreignField: "_id",
    //         as: "inventoryType",
    //       },
    //     },
    //     {
    //       $unwind: "$inventoryType",
    //     },
    //     {
    //       $addFields: {
    //         inventryType: "$inventoryType.name",
    //       },
    //     },
    //     {
    //       $project: {
    //         inventoryType: 0,
    //       },
    //     },
    //   ]);

    //   const Response = {
    //     filterdInventory,
    //   };

    //   // sending All Inventry
    //   res.json({
    //     message: "Successfully get All Inventry",
    //     data: Response,
    //     success: true,
    //   });
    // } else {
    //   res.json({
    //     message: "Pls provide correct query",
    //     success: true,
    //   });
    // }
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

export const Delete = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {



      const responseError = {
        req: req,
        result: -1,
        message: messages.BAD_REQUEST,
        payload: {},
        logPayload: false,
      };
      
      
     return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseError));

    } 
    


   
    
    else {



      const isAdded = await models.Machine.findOne({"inventry._inventry":id})

      if(isAdded){



  
  const responseError = {
    req: req,
    result: -1,
    message: messages.INVENTRY_DELETE_ERROR,
    payload: {},
    logPayload: false,
  };
  
return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
     .json(utility.createResponseObject(responseError));


}

      const deletedInventry = await models.Inventory.findOneAndUpdate(
        {
          _id: id,
        },

        {
          $set: {
            isDeleted: true,
          },
        },

        {
          new: true,
        }
      );




  
      if (!deletedInventry) {


        const responseError = {
          req: req,
          result: -1,
          message: messages.INVENTORY_NOT_EXIST,
          payload: {},
          logPayload: false,
        };
        
      return  res.status(enums.HTTP_CODES.NOT_FOUND)
           .json(utility.createResponseObject(responseError));
     
      } 



      const payload = {
        deletedInventry,
      };
    
    
    
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.INVENTORY_DELETED,
        payload: payload,
        logPayload: false,
      };
      
     return  res.status(enums.HTTP_CODES.OK)
         .json(utility.createResponseObject(data4createResponseObject));
 
    }
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


export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {



      
      const responseError = {
        req: req,
        result: -1,
        message: messages.BAD_REQUEST,
        payload: {},
        logPayload: false,
      };
      
      
     return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseError));

    } else {
    
      //Upading Inventory in the Db
      const updatedInventry = await models.Inventory.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            ...req.body,
          },
        },

        {
          new: true,
        }
      );




        
      if (!updatedInventry) {


        const responseError = {
          req: req,
          result: -1,
          message: messages.INVENTORY_NOT_EXIST,
          payload: {},
          logPayload: false,
        };
        
      return  res.status(enums.HTTP_CODES.NOT_FOUND)
           .json(utility.createResponseObject(responseError));
     
      } 






      const payload = {
        updatedInventry,
      };
    
    
    
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.INVENTORY_UPDATED,
        payload: payload,
        logPayload: false,
      };
      
     return  res.status(enums.HTTP_CODES.OK)
         .json(utility.createResponseObject(data4createResponseObject));
  
 



    }
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



