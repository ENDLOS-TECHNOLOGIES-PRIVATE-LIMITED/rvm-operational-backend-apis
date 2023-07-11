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




     // Adding Machine in the Db
     const problem = await models.problem.create({
        ...req.body,
       
       });

      const payload = {
        problem,
      };


    const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.PROBLEM_CREATED,
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


export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {

   


    const {id,nestedData,allData} =req.query;


    
        const matchStage:any = {
          };
    
    // if (allData==='false'|| !allData) {
    //       matchStage.isDeleted =false;
    //     }
        
    
        if (id) {
          matchStage._id =  new mongoose.Types.ObjectId(id.toString());
        }
    
       
        
    







    
    const problems = await models.problem.aggregate([
      
        { $match: matchStage },

        { $sort: { createdAt: -1 } },


      {
        $lookup: {
          from: 'solutions',
          localField: '_id',
          foreignField: 'problemId',
          as: 'solutions'
        }
      },
      {
        $lookup: {
          from: 'invetrytypes',
          localField: 'problemType',
          foreignField: '_id',
          as: 'problemType'
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          description: { $first: '$description' },
          category: { $first: '$category' },
          solutions: { $first: '$solutions' },
          problemType: {
            $first: { $arrayElemAt: ["$problemType", 0] }  
          },
       
         
        },
        
      },

    
     
      {
        $project: {
         _id: '$_id',
         name: '$name',
         description: '$description',
         category: '$category',
         solutions: '$solutions',
        
         problemType: {
          $cond: {
            if: { $eq: ["$problemType", null] },
            then: {
              name: "-",
              _id: "-"
            },
            else: {
              name: "$problemType.name",
              _id: "$problemType._id"
            }
          }
        }



          // problemType: {
          //   name: "$problemType.name",
          //   _id: "$problemType._id"
          // },
          
        }
      }
     
    ]);

    
  const payload = {
      problems
  };    





  const data4createResponseObject = {
    req: req,
    result: 0,
    message: messages.PROBLEM_FETCHED,
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

export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let{ id }= req.params;

  
    if (!id) {

      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.PROBLEM_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
     return res.status(enums.HTTP_CODES.BAD_REQUEST)
         .json(utility.createResponseObject(responseCatchError));

} else {
      const updatedProblem = await models.problem.findOneAndUpdate(
        {
          _id: id,
        },

        {
          $set: {
            ...req.body,
       
        }
      }
      ,
      {
        new:true
      }

      );


      if (!updatedProblem) {


        const responseCatchError = {
          req: req,
          result: -1,
          message: messages.NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        
       return res.status(enums.HTTP_CODES.NOT_FOUND)
           .json(utility.createResponseObject(responseCatchError));



      } 

      const payload = {
        updatedProblem,
      };



      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.PROBLEM_UPDATED,
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
    let{ id }= req.params;

    if (!id) {

      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.PROBLEM_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
     return res.status(enums.HTTP_CODES.BAD_REQUEST)
         .json(utility.createResponseObject(responseCatchError));
     
    } else {
      const deletedProblem = await models.problem.findOneAndDelete(
        {
          _id: id,
        }

      );

      


      if (!deletedProblem) {


        const responseCatchError = {
          req: req,
          result: -1,
          message: messages.NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        
       return res.status(enums.HTTP_CODES.NOT_FOUND)
           .json(utility.createResponseObject(responseCatchError));
      
      } 

      const payload = {
        deletedProblem,
      };


      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.PROBLEM_DELETED,
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

