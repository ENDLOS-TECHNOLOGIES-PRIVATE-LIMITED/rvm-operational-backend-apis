import { Request, Response, NextFunction } from "express";
// import User from '../models/user';
import models from "../models";
import utility from '../utility';
import enums from '../json/enum.json'
import messages from '../json/message.json'
import mongoose from "mongoose";


interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}

export const GetByCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.query;

       if (!id) {
        const responseCatchError = {
          req: req,
          result: -1,
          message: messages.CUSTOMER_ID_REQUIRED,
          payload: {},
          logPayload: false,
        };
        
        return res.status(enums.HTTP_CODES.BAD_REQUEST)
           .json(utility.createResponseObject(responseCatchError));



       }

       else{


    const Branches = await models.Branch.find({
      "customer._customerId": id,
      isDeleted: false,
    });
    const Customer = await models.Customer.findOne({
      _id: id,
     
    });

    const payload = {
      Customer,
      Branches,
    };


  const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.BRANCH_FETCHED,
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
export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {

const checkBranch = await models.Branch.findOne({
  "customer._customerId": req.body.customerId,
  name: req.body.name,
});

if(checkBranch){


  const responseCatchError = {
    req: req,
    result: -1,
    message: messages.BRANCH_EXIST,
    payload: {},
    logPayload: false,
  };
  
  return res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
     .json(utility.createResponseObject(responseCatchError));
  
}

const Branch = await models.Branch.create({
     ...req.body,
      customer: {
        _customerId: req.body.customerId,
        date: Date.now(),
      },
      createdBy: {
        _user: req?.user.id,
      },
    });

    const payload = {
      Branch,
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
export const Update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {

      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.BRANCH_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
     return res.status(enums.HTTP_CODES.BAD_REQUEST)
         .json(utility.createResponseObject(responseCatchError));


    } else{
      //Upading customoer in the Db
      const updatedBranch = await models.Branch.findOneAndUpdate(
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



      if(!updatedBranch){



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
        updatedBranch,
      };


    const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.BRANCH_UPDATED,
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
export const Delete = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {
      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.BRANCH_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
     return res.status(enums.HTTP_CODES.BAD_REQUEST)
         .json(utility.createResponseObject(responseCatchError));

    
    } else{



      const isMachineExist = await models.Machine.findOne({"branchId":new mongoose.Types.ObjectId(id.toString()),isDeleted:false})


      
    
      if(isMachineExist){
  
  
        const responseError = {
          req: req,
          result: -1,
          message: messages.BRANCH_DELETE_ERROR,
          payload: {},
          logPayload: false,
        };
        
      return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
           .json(utility.createResponseObject(responseError));
  
  
      }



      //Upading customoer in the Db
      // const deltedBranch = await models.Branch.findByIdAndDelete(
      //   {
      //     _id: id,
      //   },
      // );
      const deltedBranch = await models.Branch.findOneAndUpdate(
        {
          _id: id,
        },

        {
          $set: {
            isDeleted: true,
          },
        },

        {
          new:true
        }

      );


      if(!deltedBranch){



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
        deltedBranch,
      };

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.BRANCH_DELETED,
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






