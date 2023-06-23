import { Request, Response, NextFunction } from "express";
// import User from '../models/user';
import models from "../models";
import helpers from "../helpers";
import mongoose, { model } from "mongoose";
import deleteGcsFile from "../helpers/deleteGcsFile";

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

      const Response = {
        solution,
      };

      //sending Registerd User response
      res.json({
        message: "Solution Added Successfully ",
        data: Response,
        success: true,
      });
    
    

  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};



export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {

   

    const {id,problemId}=req.query;

       // Validation: Check if only one parameter is provided
       const paramsCount = [id, problemId].filter(Boolean).length;

       console.log({paramsCount});
       if (paramsCount >1) {


         res.status(400).json({ message: 'Bad Request', success: false });
         return

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
          description: { $first: '$description' },
          images: { $first: '$images' },
          problem: {
            $first: { $arrayElemAt: ["$problem", 0] }  
          },
       
         
        },
        
      },
     
      {
        $project: {
         _id: '$_id',
         description: '$description',
         images: '$images',
          problem: {
            name: "$problem.name",
            _id: "$problem._id"
          },
          
        }
      }
     
    ]);

    
  const Response = {
    solutions
  };    

  //sending Registerd User response
  res.json({
    message: "Solution fetched Successfully ",
    data: Response,
    success: true,
  });


 
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};


export const Delete = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.params.id;

    const deletedSolution = await models.solution.findByIdAndDelete(
        {
          _id: new mongoose.Types.ObjectId(id.toString()),

        });


        if(!deletedSolution){


          res.status(404).json({
            message: "Record Not Found",
            data: {},
            success: false,
          });
        
        }


      const  gcsDeletedfiles = await deleteGcsFile(deletedSolution.images)



      const Response = {
        deletedSolution,
        gcsDeletedfiles
      };

      res.json({
        message: "Machine Deleted Successfully",
        data: Response,
        success: true,
      });
    
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const Update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.params.id;

      const Solution = await models.solution.findById(new mongoose.Types.ObjectId(id.toString()));



if(!Solution){

  res.status(404).json({
    message: "Record not found",
    success: false,
  });
}

    const  gcsDeletedfiles =await deleteGcsFile(Solution.images)


      const updatedSolution = await models.solution.findByIdAndUpdate({

       _id: new mongoose.Types.ObjectId(id.toString())

      },{

        ...req.body                 
      },{new:true})


        const Response = {
        updatedSolution,
        };

      res.json({
        message: "Solution Updated Successfully",
        data: Response,
        success: true,
      });
    
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};



