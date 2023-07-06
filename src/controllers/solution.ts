import { Request, Response, NextFunction } from "express";
// import User from '../models/user';
import models from "../models";
import helpers from "../helpers";
import mongoose, { model } from "mongoose";
import deleteGcsFile from "../helpers/deleteGcsFile";
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


     // Adding Machine in the Db
     const solution = await models.solution.create({
        ...req.body,

       
       });

      const payload = {
        solution,
      };




      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SOLUTION_CREATED,
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

   

    const {id,problemId}=req.query;

       // Validation: Check if only one parameter is provided
       const paramsCount = [id, problemId].filter(Boolean).length;

       console.log({paramsCount});
       if (paramsCount >1) {


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


    const matchStage:any = {};


    if (id) {
      matchStage._id =  new mongoose.Types.ObjectId(id.toString());
    }

    if (problemId) {
      matchStage.problemId =  new mongoose.Types.ObjectId(problemId.toString());
    }



    const solutions = await models.solution.aggregate([


      {
     
        $match:matchStage
      }
      ,
   
      {
        $lookup: {
          from: 'problems',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem'
        }
      },
      {
        $group: {
          _id: '$_id',
          solution: { $first: '$solution' },
          problem: {
            $first: { $arrayElemAt: ["$problem", 0] }  
          },
       
         
        },
        
      },
     
      {
        $project: {
         _id: '$_id',
          solutions: '$solution',
          problem: {
            name: "$problem.name",
            _id: "$problem._id"
          },
          
        }
      }
     
    ]);

    
  const payload = {
    solutions
  };    

  const data4createResponseObject = {
    req: req,
    result: 0,
    message: messages.SOLUTION_FETCHED,
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
    
    
return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(utility.createResponseObject(responseCatchError));

   
  }
};


export const Delete = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.params.id;


    if (!id) {



      const responseCatchError = {
        req: req,
        result: -1,
        message: messages.SOLUTION_ID_REQUIRED,
        payload: {},
        logPayload: false,
      };
      
      
      return  res.status(enums.HTTP_CODES.BAD_REQUEST)
        .json(utility.createResponseObject(responseCatchError));

    }

    const deletedSolution = await models.solution.findByIdAndDelete(
        {
          _id: new mongoose.Types.ObjectId(id.toString()),

        });


        if(!deletedSolution){


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






        const images = deletedSolution?.solution.filter(element=>element?.image !==undefined ).map(element => element.image)

if(images.length>0){
  await deleteGcsFile(images)
}


      const payload = {
        deletedSolution,
        };






      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SOLUTION_DELETED,
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
    let id = req.params.id;



      const Solution = await models.solution.findById(new mongoose.Types.ObjectId(id.toString()));



if(!Solution){



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


const images = Solution?.solution.filter(element=>element?.image !==undefined ).map(element => element.image)

if(images.length>0){
  await deleteGcsFile(images)
}


    


      const updatedSolution = await models.solution.findByIdAndUpdate({

       _id: new mongoose.Types.ObjectId(id.toString())

      },{

        ...req.body                 
      },{new:true})






        const payload = {
        updatedSolution,
        };




        const data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.SOLUTION_UPDATED,
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



