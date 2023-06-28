import { Request, Response, NextFunction } from "express";
import helpers from "../helpers";
import models from "../models";
import mongoose, { model } from "mongoose";
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

    const {brandName,inventryTypeId,brandId,serialNumber} =req.body;

    // checking the serila number exist or not 
    const isSerialExist = await models.Inventory.find({ serialNumber: req.body.serialNumber });
    if (isSerialExist.length > 0) {
     
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




    if(brandName && inventryTypeId){

  const createdBrand = await models.inventryBrand.create({
  name:brandName,
  inventryTypeId:inventryTypeId
    })
  
  


    const addedInventry = await models.Inventory.create({
      brandId:createdBrand._id,
      ...req.body,

      });

      
 
 
 
 
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



  
  


     

    }else if(serialNumber&&brandId){

    // Adding Inventry in the Db
    const addedInventry = await models.Inventory.create({
      ...req.body,
      });
 
 
 
 
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
 

    }
else{


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
            invetrybrands: "$invetrybrands",
            invetrytypes: "$invetrytypes"
          }
        },
        {
          $project: {
            invetrybrands: {
              _id: 1,
              inventryTypeId: 1,
              name: 1
            },
            invetrytypes: {
              _id: 1,
              name: 1
            },
            // Add other fields you want to include in the result
            _id: 1,
            brandId: 1,
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
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
    } else {
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

      const Response = {
        deletedInventry,
      };

      res.json({
        message: "Inventry Deleted Successfully",
        data: Response,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};


export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
    } else {
      // checking the serila number exist or not
    //   const isSerialExist = await models.Inventory.findOne({ serialNumber: req.body.serialNumber,_id:id });

    //  if (isSerialExist ) {
    //       return res.status(400).json({ error: "SerialNumber already exist" });
    //     }

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

      const Response = {
        updatedInventry,
      };

      //sending updated Inventory response
      res.json({
        message: "Inventory Updated Successfully",
        data: Response,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};



