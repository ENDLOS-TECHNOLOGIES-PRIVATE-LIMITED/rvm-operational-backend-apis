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
      
     return res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseCatchError));
      }

      else{


  
    //Registering vendor in the Db
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

    return  res
        .status(enums.HTTP_CODES.OK)
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
export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {

const {id,nestedData} =req.query;
let vendors;

    const matchStage:any = {
      isDeleted:false
    };


    if (id) {
      matchStage._id =  new mongoose.Types.ObjectId(id.toString());
    }

   
    

//nested Data is requied when we want to get all data about a vendor 

      if(id && nestedData){


         vendors = await models.vendor.aggregate([
          { $match: matchStage }, // Filter vendors with isDelete set to false
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "customers",
              localField: "_id",
              foreignField: "vendorId",
              as: "customers",
            },
          },
          {
            $lookup: {
              from: "branches",
              localField: "customers._id",
              foreignField: "customer._customerId",
              as: "branches",
            },
          },
          {
            $lookup: {
              from: "machines",
              localField: "branches._id",
              foreignField: "branchId",
              as: "machines",
            },
          },
        ]).exec();
        


      }


else{


       vendors = await models.vendor.aggregate([
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
        {
          $lookup: {
            from: "customers",
            localField: "_id",
            foreignField: "vendorId",
            as: "customers",
          },
        },
      ]).exec();
}

 

      if(vendors.length==0){



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

     return res
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
export const deleteVendor = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;
 
     // upading  UserRole in the Db
 const deletedVendor = await models.vendor.findOneAndUpdate(
  {_id:new mongoose.Types.ObjectId(id.toString())},
  {
    isDeleted:true

},
{
  new:true
}
);

if(!deletedVendor){

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


const payload = {
  deletedVendor
};



const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.VENDOR_DELETED,
  payload: payload,
  logPayload: false,

};

return  res
  .status(enums.HTTP_CODES.OK)
  .json(utility.createResponseObject(data4createResponseObject));




  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};


