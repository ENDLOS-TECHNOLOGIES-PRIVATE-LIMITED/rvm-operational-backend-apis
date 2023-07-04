import { Request, Response, NextFunction } from "express";
import utility from '../utility';
import enums from '../json/enum.json'
import messages from '../json/message.json'
// import User from '../models/user';
import models from "../models";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}

export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {
    

    const { inventry } = req.body;


    if(inventry){        
const inventryIds = inventry.map((item) => new mongoose.Types.ObjectId(item._inventry.toString()));


         const inventryAvailability = await models.Machine.find({
           "inventry._inventry": { $in: inventryIds },
         }).exec();


         if (inventryAvailability.length > 0) {
           return res.status(400).json({
             error: "inventry already assigned to a machine",
           });
         }

    }

   



    const isExist = await models.Machine.findOne({ machineId: req.body.machineId });

    if (isExist) {

      const responseError = {
        req: req,
        result: -1,
        message: messages.MACHINE_EXIST,
        payload: {},
        logPayload: false,
      };
      
     return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
         .json(utility.createResponseObject(responseError));

   
    } else {
      // Adding Machine in the Db
      const Machine = await models.Machine.create({
        ...req.body,
        "branch._branchId":req.body.branchId   
       });

      const payload = {
        Machine,
      };





      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.MACHINE_CREATED,
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

    const { type, branchId } = req.query;

   
    if(type=="all"){
    
    const AllMachines = await models.Machine.aggregate([
      
      { $match: { isDeleted: false } }, // Filter machines with isDeleted set to false
      // { $unwind: '$inventry' }, // Unwind the inventory array
      {
        $lookup: {
          from: 'invetries',
          localField: 'inventry._inventry',
          foreignField: '_id',
          as: 'inventoryDetails'
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: 'branchId',
          foreignField: '_id',
          as: 'branch'
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'branch.customer._customerId',
          foreignField: '_id',
          as: 'customer'
        }
      },

      {
        $unwind: "$inventoryDetails"
      },
    

      {
        $group: {
          _id: '$_id',
          machineId: { $first: '$machineId' },
          branch: {
            $first: { $arrayElemAt: ["$branch", 0] }
          },
          customer: {
            $first: { $arrayElemAt: ["$customer", 0] }  
          },
          warrentyStartDate: { $first: '$warrentyStartDate' },
          
            inventoryDetails: {
            $push: "$inventoryDetails"
          }

        },
        
      },
      {
        $project: {
          machineId:"$machineId",
          warrentyStartDate:"$warrentyStartDate",
          branch: {
            name: "$branch.name",
            _id: "$branch._id"
          },
          customer: {
            name: "$customer.name",
            _id: "$customer._id"
          },
          inventoryDetails:"$inventoryDetails"
        }
      }
     
    ]);

    
  const payload = {
    // Machines,
    AllMachines
  };    


  

  const data4createResponseObject = {
    req: req,
    result: 0,
    message: messages.MACHINE_FETCHED,
    payload: payload,
    logPayload: false,

  };

return  res
    .status(enums.HTTP_CODES.OK)
    .json(utility.createResponseObject(data4createResponseObject));



  




    }

    else if (branchId) {
      const Machines = await models.Machine.find({ isDeleted: false, "branch._branchId": branchId });
      const payload = {
        Machines,
       
      };



      
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.MACHINE_FETCHED,
      payload: payload,
      logPayload: false,
  
    };

  return  res
      .status(enums.HTTP_CODES.OK)
      .json(utility.createResponseObject(data4createResponseObject));

  

  
    } else {



      
      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.BAD_REQUEST,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseCatchError));


    
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
        message: messages.MACHINE_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseError));

    } else {
      const deletedInventry = await models.Machine.findOneAndUpdate(
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



      if(!deletedInventry){


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
        deletedInventry,
      };




      
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.MACHINE_DELETED,
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
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));
    
  }
};


export const Assign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let {branchId} = req.body;

    let {machineId}=req.query;

    if ((!machineId || !branchId)) {

      

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

    else{
          // Assigning Machine 
        const assignedMachine = await models.Machine.findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(machineId.toString()),
            
          },
          {
            $set: {
              branchId: req.body.branchId,
            },
          },

          {
            new: true,
          }
        );


        const payload = {
          assignedMachine,
        };


        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.MACHINE_ASSIGNED,
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
        message: messages.MACHINE_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseError));
     
    } else {
      // checking the serila number exist or not
        const isMachineIdExist = await models.Machine.findOne({ machineId: req.body.machineId });

      
        if (isMachineIdExist&& isMachineIdExist?._id.toString() !== id) {

          
      const responseError = {
        req: req,
        result: -1,
        message: messages.MACHINE_EXIST,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.DUPLICATE_VALUE)
        .json(utility.createResponseObject(responseError));

        } else {
        
          const updatedMachine = await models.Machine.findOneAndUpdate(
            {
              // _id: new mongoose.Types.ObjectId(id.toString()),
              _id: id,
            },
            {
              $set: {
                ...req.body,
                branch: {
                  _branchId: { type: mongoose.Schema.Types.ObjectId },
                  date: Date.now(),
                },
              },
            },

            {
              new: true,
            }
          );


          if(!updatedMachine){


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
            updatedMachine,
          };

          
    const data4createResponseObject = {
      req: req,
      result: 0,
      message: messages.MACHINE_UPDATED,
      payload: payload,
      logPayload: false,
  
    };

   return res
      .status(enums.HTTP_CODES.OK)
      .json(utility.createResponseObject(data4createResponseObject));


        }

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

