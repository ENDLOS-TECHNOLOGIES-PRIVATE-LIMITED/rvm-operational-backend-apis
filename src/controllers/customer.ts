import { Request, Response, NextFunction } from "express";
// import User from '../models/user';
import models from "../models";
import utility from '../utility';
import enums from '../json/enum.json'
import messages from '../json/message.json'
import mongoose, { model } from 'mongoose';
interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}


export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {


    const {branchName} = req.body

    //Registering customoer in the Db
    const Customer = await models.Customer.create({
      ...req.body,
      createdBy: {
        _user: req?.user.id,
      },
    });

    let Branch ;

    if(branchName){

       Branch = await models.Branch.create({

        "customer._customerId": Customer._id,
        name: branchName,
      
      });

    }

    const payload = {
      Customer,
      Branch
   };


   const data4createResponseObject = {
    req: req,
    result: 0,
    message: messages.CUSTOMER_CREATED,
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
    
    
 return  res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));
   
  }
};
export const GetAll = async (req: AuthenticatedRequest, res: Response) => {
  try {


    
const {allData} =req.query;

    const matchStage:any = {
    };

if (allData==='false'|| !allData) {
    matchStage.isDeleted =false;
  }
  
const AllCustomer = await models.Customer.aggregate([
  { $match: matchStage}, // Filter customers with isDelete set to false
      // { $match: { isDeleted: false } }, // Filter customers with isDelete set to false
      { $sort: { createdAt: -1 } },

      {
        $lookup: {
          from: "branches",
          let: { customerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$customer._customerId", "$$customerId"] },

                    allData === 'false'|| allData ?{}: { $eq: ['$isDeleted', false] }
            ]
                }
              }
            }
          ],
          as: "branches",
        },
      },

//  {
//         $lookup: {
//           from: "branches",
//           let: { customerId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: {
//                   $and: [
//                     { $eq: ["$customer._customerId", "$$customerId"] },
//                     { $eq: ["$isDeleted", false] }
//                   ]
//                 }
//               }
//             }
//           ],
//           as: "branches",
//         },
//       },

    ]).exec();
     
   



    const payload = {
      // Customer,
      Customer: AllCustomer,
    };


    
   const data4createResponseObject = {
    req: req,
    result: 0,
    message: messages.CUSTOMER_FETCHED,
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
    
    
 return  res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));


  } 
};

export const Get = async (req: AuthenticatedRequest, res: Response) => {
  try {
   
    // let id = req.query.id;

    const {id,nestedData} = req.query;

   



    if (!id) {


      const responseError = {
        req: req,
        result: -1,
        message: messages.CUSTOMER_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
    return  res.status(enums.HTTP_CODES.BAD_REQUEST)
         .json(utility.createResponseObject(responseError));
   
    }
    
    else if(id&& nestedData){

      const matchStage:any = {
        isDeleted:false
      };
  
  
      if (id) {
        matchStage._id =  new mongoose.Types.ObjectId(id.toString());
      }
  
     
      


     const  Customer = await models.Customer.aggregate([
        { $match: matchStage }, // Filter vendors with isDelete set to false
        { $sort: { createdAt: -1 } },
{
          $lookup: {
            from: "branches",
            let: { customerId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$customer._customerId", "$$customerId"] },
                      { $eq: ["$isDeleted", false] }
                    ]
                  }
                }
              }
            ],
            as: "branches",
          },
        },


      ]).exec();


      // return res.send('done')

      const payload = {
        Customer,
      };

      

  
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.CUSTOMER_FETCHED,
        payload: payload,
        logPayload: false,
    
      };
    
    return  res
        .status(enums.HTTP_CODES.OK)
        .json(utility.createResponseObject(data4createResponseObject));



    }
    
    else{
      //Upading customoer in the Db
      const Customer = await models.Customer.findOne(
        {
          _id: id,
          isDeleted:false
        },
        
      );


      if (!Customer) {


        const responseError = {
          req: req,
          result: -1,
          message: messages.CUSTOMER_NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        
      return  res.status(enums.HTTP_CODES.NOT_FOUND)
           .json(utility.createResponseObject(responseError));
     
      } 



      const payload = {
        Customer,
      };

      

  
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.CUSTOMER_FETCHED,
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
export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
   
    let id = req.query.id;



    if (!id) {

      const responseError = {
        req: req,
        result: -1,
        message: messages.CUSTOMER_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
    return  res.status(enums.HTTP_CODES.BAD_REQUEST)
         .json(utility.createResponseObject(responseError));

   
    } else{
      //Upading customoer in the Db
      const updatedCustomer = await models.Customer.findOneAndUpdate(
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




      
      if (!updatedCustomer) {


        const responseError = {
          req: req,
          result: -1,
          message: messages.CUSTOMER_NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        
      return  res.status(enums.HTTP_CODES.NOT_FOUND)
           .json(utility.createResponseObject(responseError));
     
      } 

      const payload = {
        updatedCustomer,
      };


        
   const data4createResponseObject = {
    req: req,
    result: 0,
    message: messages.CUSTOMER_FETCHED,
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

      const responseError = {
        req: req,
        result: -1,
        message: messages.CUSTOMER_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
    return  res.status(enums.HTTP_CODES.BAD_REQUEST)
         .json(utility.createResponseObject(responseError));

    } else {


      const isBranchExist = await models.Branch.findOne({"customer._customerId":new mongoose.Types.ObjectId(id.toString()),isDeleted:false})


      
    
      if(isBranchExist){
  
  
        const responseError = {
          req: req,
          result: -1,
          message: messages.CUSTOMER_DELETE_ERROR,
          payload: {},
          logPayload: false,
        };
        
      return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
           .json(utility.createResponseObject(responseError));
  
  
      }
    
      const deletedCustomer = await models.Customer.findOneAndUpdate(
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


      
      if (!deletedCustomer) {


        const responseError = {
          req: req,
          result: -1,
          message: messages.CUSTOMER_NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        
      return  res.status(enums.HTTP_CODES.NOT_FOUND)
           .json(utility.createResponseObject(responseError));
     
      } 


      const payload = {
        deletedCustomer,
      };


      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.CUSTOMER_DELETED,
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

