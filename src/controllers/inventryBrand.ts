import { Request, Response, NextFunction } from 'express';
import models from '../models'
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
    const {  inventryTypeId ,name} = req.body;

    let isBrandRegisterd = await models.inventryBrand.findOne({ name,inventryTypeId });


    
    if (isBrandRegisterd) {
        const responseCatchError = {
        req: req,
        result: -1,
        message: messages.BRAND_EXIST,
        payload: {},
        logPayload: false,
      };
      
      res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseCatchError));
      }

      else{


  
    //Registering vendor in the Db
    const InventryBrand = await models.inventryBrand.create({
      ...req.body,   
    });




    let payload = {
        InventryBrand,
      };
    

    const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.BRAND_CREATED,
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
      
      
      res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utility.createResponseObject(responseCatchError));
  


    // res.status(500).json({ message: error.message, success: false });
  }
};
export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {


const {id} =req.query;

    const matchStage:any = {};


    if (id) {
      matchStage._id =  new mongoose.Types.ObjectId(id.toString());
    }

   
   
        const brands = await models.inventryBrand.aggregate([
        { $match: matchStage}, // Filter customers with isDelete set to false
        { $sort: { createdAt: -1 } },

        
        // {
        //   $lookup: {
        //     from: "customers",
        //     localField: "_id",
        //     foreignField: "vendorId",
        //     as: "customers",
        //   },
        // },
      ]).exec();



      

      if(brands.length==0){



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
        brands,
      };
    

    const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.BRAND_FETCHED,
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

       const brand = await models.inventryBrand.findOneAndUpdate(
  {_id:new mongoose.Types.ObjectId(id.toString())},
  {
    ...req.body

},{
  new:true
}
);



if (!brand) {
    const responseError = {
      req: req,
      result: -1,
      message: messages.BRAND_NOT_EXIST,
      payload: {},
      logPayload: false,
    };

    return res
      .status(enums.HTTP_CODES.NOT_FOUND)
      .json(utility.createResponseObject(responseError));
  }




let payload = {
    brand,
};


const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.BRAND_UPDATED,
  payload: payload,
  logPayload: false,

};

return res
  .status(enums.HTTP_CODES.OK)
  .json(utility.createResponseObject(data4createResponseObject));





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
export const deleteBrand = async (req: AuthenticatedRequest, res: Response) => {
  try {
   

    const {id} = req.params;
 
     // upading  UserRole in the Db
 const deleteBrand = await models.inventryBrand.findOneAndUpdate(
  {_id:new mongoose.Types.ObjectId(id.toString())},
  {
    isDeleted:true

},
{
  new:true
}
);

if(!deleteBrand){

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
    deleteBrand
};



const data4createResponseObject = {
  req: req,
  result: 0,
  message: messages.BRAND_DELETED,
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


