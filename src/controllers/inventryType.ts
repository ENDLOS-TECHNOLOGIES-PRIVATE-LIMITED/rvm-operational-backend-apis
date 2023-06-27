import { Request, Response, NextFunction } from "express";
import models from "../models";
import mongoose from "mongoose";
import utility from '../utility';
import enums from '../json/enum.json'
import messages from '../json/message.json'

interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}

export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {

// const InvetryTypeIsExist = await models.InvetryType.find({name:req.body.name,isDeleted:false})

const InvetryTypeIsExist = await models.InvetryType.find({
  name: { $regex: new RegExp("^" + req.body.name, "i") },
  isDeleted: false,
});


if(InvetryTypeIsExist.length>0){


  const responseError = {
    req: req,
    result: -1,
    message: messages.INVENTRY_TYPE_EXIST,
    payload: {},
    logPayload: false,
  };
  
 return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
     .json(utility.createResponseObject(responseError));

  }

else{
  //Adding inventry type in the Db
  const Customer = await models.InvetryType.create({
    ...req.body,
  });

  const payload = {
    Customer,
  };



  const data4createResponseObject = {
    req: req,
    result: 0,
    message: messages.INVENTRY_TYPE_CREATED,
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
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));

   
  }
};
export const GetAll = async (req: AuthenticatedRequest, res: Response) => {
  try {
  

    const {type} = req.query;


    if(type=='allInventries'){

   
        const InventryTypes = await models.InvetryType.aggregate([
          { $match: { isDeleted: false } }, // Filter customers with isDelete set to false
          { $sort: { createdAt: -1 } },
          // {
          //   $lookup: {
          //     from: "invetries",
          //     localField: "_id",
          //     foreignField: "inventryType",
          //     as: "invetries",
          //   },
          // },
          {
            $lookup: {
              from: "invetrybrands",
              localField: "_id",
              foreignField: "inventryTypeId",
              as: "invetrybrands",
            },
          },
          {
            $addFields: {
              Count: { $size: "$invetrybrands" },
            },
          },
        ]).exec();


      const payload = {
        InventryTypes,
      };
    
    
    
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.INVENTRY_TYPE_FETCHED,
        payload: payload,
        logPayload: false,
      };
      
     return  res.status(enums.HTTP_CODES.OK)
         .json(utility.createResponseObject(data4createResponseObject));






      

    }

    else {

         const InventryTypes = await models.InvetryType.find({ isDeleted: false });


         const payload = {
          InventryTypes,
        };
      
      
      
        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.INVENTRY_TYPE_FETCHED,
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
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));
   
  }
};

export const Get = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let {id,type} = req.query;

    if (!id) {



      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.NOT_FOUND,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseCatchError));

    }
    else if(type=='allInventries'){

      

 const InventryTypes = await models.InvetryType.aggregate([
   { $match: { isDeleted: false, _id: new mongoose.Types.ObjectId(id.toString()) } }, // Filter customers with isDelete set to false
   { $sort: { createdAt: -1 } },
   {
     $lookup: {
       from: "invetries",
       localField: "_id",
       foreignField: "inventryType",
       as: "invetries",
     },
   },
 ]).exec();

 if(InventryTypes.length>0){
 const payload = {
   InventryTypes,
 };


 const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.INVENTRY_TYPE_CREATED,
  payload: payload,
  logPayload: false,
};

return  res.status(enums.HTTP_CODES.OK)
   .json(utility.createResponseObject(data4createResponseObject));


 }

 else{


  const responseCatchError = {
    req: req,
    result: -1,
    message: messages.NOT_FOUND,
    payload: {},
    logPayload: false,
  };
  
  
  return  res.status(enums.HTTP_CODES.BAD_REQUEST)
    .json(utility.createResponseObject(responseCatchError));

 }


      
    }
    
    else {

     
      const invetryType = await models.InvetryType.findOne({
        _id: id,
      });


    const payload = {
      invetryType,
    };
   
    const data4createResponseObject = {
     req: req,
     result: 0,
     message: messages.INVENTRY_TYPE_CREATED,
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
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));

  }
};
export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {


      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.BAD_REQUEST,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseCatchError));


    } else {
      //Upading customoer in the Db
      const updatedInventryType = await models.InvetryType.findOneAndUpdate(
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

      const payload = {
        updatedInventryType,
      };


      const data4createResponseObject = {
       req: req,
       result: 0,
       message: messages.INVENTRY_TYPE_UPDATED,
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
     
    } else {
  

      const deletedInventryType = await models.InvetryType.findOneAndUpdate(
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


      if (!deletedInventryType) {


        const responseError = {
          req: req,
          result: -1,
          message: messages.INVENTRY_TYPE_NOT_EXIST,
          payload: {},
          logPayload: false,
        };
        
        
        return  res.status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utility.createResponseObject(responseError));
       
      } 

      // const AllInventries = await models.Inventory.updateMany({ inventryType :id},{isDeleted:true},{new:true});
      const AllInventriesBrands = await models.inventryBrand.updateMany({ inventryTypeId :id},{isDeleted:true},{new:true});


      const payload = {
        deletedInventryType,
        // AllInventries,
        AllInventriesBrands
      };

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.INVENTRY_TYPE_DELETED,
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
    
    
    return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));
   
  }
};
