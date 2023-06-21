import { Request, Response, NextFunction } from "express";
// import User from '../models/user';
import models from "../models";
import helpers from "../helpers";
import mongoose, { model } from "mongoose";

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

      const Response = {
        problem,
      };

      //sending Registerd User response
      res.json({
        message: "Problem Added Successfully ",
        data: Response,
        success: true,
      });
    
    

  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};


export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {

   


    
    const problems = await models.problem.aggregate([
      
   
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
          problemType: {
            name: "$problemType.name",
            _id: "$problemType._id"
          },
          
        }
      }
     
    ]);

    
  const Response = {
      problems
  };    

  //sending Registerd User response
  res.json({
    message: "All Problems fetched Successfully ",
    data: Response,
    success: true,
  });


 
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let{ id }= req.params;

    if (!id) {
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
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
      

      );


      if (!updatedProblem) {
        res.status(404).json({
          message: "Record not found",
          success: false,
        });
      } 

      const Response = {
        updatedProblem,
      };

      res.json({
        message: " Problem Updated Successfully",
        data: Response,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const Delete = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let{ id }= req.params;

    if (!id) {
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
    } else {
      const deletedProblem = await models.problem.findOneAndDelete(
        {
          _id: id,
        }

      );


      if (!deletedProblem) {
        res.status(404).json({
          message: "Record not found",
          success: false,
        });
      } 

      const Response = {
        deletedProblem,
      };

      res.json({
        message: " Deleted Successfully",
        data: Response,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};

