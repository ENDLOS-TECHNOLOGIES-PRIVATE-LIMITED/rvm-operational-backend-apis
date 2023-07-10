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

    let isVendorRegisterd = await models.localVendor.findOne({ email });
    if (isVendorRegisterd) {
        const responseCatchError = {
        req: req,
        result: -1,
        message: messages.LOCAL_VENDOR_EXIST,
        payload: {},
        logPayload: false,
      };
      
     return res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseCatchError));
      }

      else{


  
    //Registering vendor in the Db
    const vendor = await models.localVendor.create({
      ...req.body,   
    });




    let payload = {
        vendor,
      };
    

    const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.LOCAL_VENDOR_CREATED,
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

const {id,nestedData,allData} =req.query;



    const matchStage:any = {
      };

if (allData==='false'|| !allData) {
      matchStage.isDeleted =false;
    }
    

    if (id) {
      matchStage._id =  new mongoose.Types.ObjectId(id.toString());
    }






    const  vendors = await models.localVendor.aggregate([
        { $match: matchStage}, // Filter
        { $sort: { createdAt: -1 } },



      ]).exec();




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
        message: messages.LOCAL_VENDOR_FETCHED,
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


  
    const isExist = await models.localVendor.findOne({email:email});


    if(isExist && isExist._id.toString() !== id){


      const responseError = {
        req: req,
        result: -1,
        message: messages.lOCAL_VENDOR_EMAIL_EXIST_DIFF_USER,
        payload: {},
        logPayload: false,
      };
      
      return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseError));
      

 
    }

    else {


       const vendor = await models.localVendor.findOneAndUpdate(
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




    const isAnyInventriesOfVendor = await models.Inventory.findOne({localVendor:new mongoose.Types.ObjectId(id.toString()),isDeleted:false})

    
    if(isAnyInventriesOfVendor){


      const responseError = {
        req: req,
        result: -1,
        message: messages.LOCAL_VENDOR_DELETE_ERROR,
        payload: {},
        logPayload: false,
      };
      
    return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseError));


    }



     // upading  UserRole in the Db
 const deletedVendor = await models.localVendor.findOneAndUpdate(
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
  
  
  return  res.status(enums.HTTP_CODES.NOT_FOUND)
    .json(utility.createResponseObject(responseCatchError));


}


const payload = {
  deletedVendor,
};



const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.LOCAL_VENDOR_DELETED,
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


