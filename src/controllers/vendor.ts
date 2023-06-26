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




export const add = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Destructuring data from request
    const {  email } = req.body;

    let isVendorRegisterd = await models.vendor.findOne({ email });
    if (isVendorRegisterd) {
        const responseCatchError = {
        req: req,
        result: -1,
        message: messages.VENDOR_EXIST,
        payload: {},
        logPayload: false,
      };
      
      res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseCatchError));
      }

   
    //Registering UserRole in the Db
    const vendor = await models.vendor.create({
      ...req.body,   
    });




    let payload = {
        vendor,
      };
    

    const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.VENDOR_CREATED,
        payload: payload,
        logPayload: false,
    
      };

      res
        .status(enums.HTTP_CODES.OK)
        .json(utility.createResponseObject(data4createResponseObject));

    

  
  } catch (error: any) {


    const responseCatchError = {
        req: req,
        result: -1,
        message: messages.GENERAL_EROOR,
        payload: {},
        logPayload: false,
      };
      
      
      res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utility.createResponseObject(responseCatchError));
  


    res.status(500).json({ message: error.message, success: false });
  }
};
export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {


const {id} =req.query;

    const matchStage:any = {};


    if (id) {
      matchStage._id =  new mongoose.Types.ObjectId(id.toString());
    }

   
   
        const vendors = await models.vendor.aggregate([
        { $match: matchStage}, // Filter customers with isDelete set to false
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "customers",
            localField: "_id",
            foreignField: "vendorId",
            as: "customers",
          },
        },
      ]).exec();



    let payload = {
        vendors,
      };
    

    const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.VENDOR_FETCHED,
        payload: payload,
        logPayload: false,
    
      };

      res
        .status(enums.HTTP_CODES.OK)
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

export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;

    const {email}= req.body;


  
    const isExist = await models.vendor.findOne({email:email});


    if(isExist && isExist._id.toString() !== id){


      const responseError = {
        req: req,
        result: -1,
        message: messages.VENDOR_EMAIL_EXIST_DIFF_USER,
        payload: {},
        logPayload: false,
      };
      
      return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseError));
      

 
    }

    else {


       const vendor = await models.vendor.findOneAndUpdate(
  {_id:new mongoose.Types.ObjectId(id.toString())},
  {
    ...req.body

},{
  new:true
}
);


let payload = {
  vendor,
};


const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.VENDOR_UPDATED,
  payload: payload,
  logPayload: false,

};

return res
  .status(enums.HTTP_CODES.OK)
  .json(utility.createResponseObject(data4createResponseObject));





    }


  



 
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
// export const deleteRole = async (req: AuthenticatedRequest, res: Response) => {
//   try {
   

//     const {id} = req.params;

   

//  // upading  UserRole in the Db
//  const userRole = await models.UserRole.findOneAndUpdate(
//   {_id:new mongoose.Types.ObjectId(id.toString())},
//   {
//     isActive:false

// },{
//   new:true
// }
// );


// const Response = {
// userRole
// };

// //sending Registerd User response
// res.json({
//   message: " User Role Deleted Successfully ",
//   data: Response,
//   success: true,
// });

    
 
//   } catch (error: any) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };


