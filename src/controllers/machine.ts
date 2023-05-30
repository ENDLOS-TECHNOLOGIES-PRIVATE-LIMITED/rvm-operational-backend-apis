import { Request, Response, NextFunction } from "express";
// import User from '../models/user';
import models from "../models";
import helpers from "../helpers";
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

         //chekding inventry which provided by user are assigned to another machine or not
         const inventryAvailability = await models.Inventory.aggregate([
           {
             $match: {
               _id: { $in: inventryIds },
             },
           },
           {
             $lookup: {
               from: "machines",
               localField: "_id",
               foreignField: "inventry._inventry",
               as: "machines",
             },
           },
           {
             $unwind: "$machines",
           },
           {
             $unwind: "$machines.inventry",
           },
           {
             $project: {
               _inventry: "$machines.inventry._inventry",
               isAvailable: {
                 $eq: ["$machines.inventry._inventry", null],
               },
             },
           },
         ]);

         if (inventryAvailability.length > 0) {
           return res.status(400).json({
             error: "inventry already assigned to a machine",
           });
         }

    }

   



    const isExist = await models.Machine.findOne({ machineId: req.body.machineId });

    if (isExist) {
      return res.status(400).json({
        error: "machineId already exist",
        
      });
    } else {
      //Adding Machine in the Db
      const Machine = await models.Machine.create({
        ...req.body,
        "branch._branchId":req.body.branchId   
       });

      const Response = {
        Machine,
      };

      //sending Registerd User response
      res.json({
        message: "Machine Added Successfully ",
        data: Response,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};


export const getAll = async (req: AuthenticatedRequest, res: Response) => {
  try {

    const { type, branchId } = req.query;

   
    if(type=="all"){
    const Machines = await models.Machine.find({isDeleted:false});
  const Response = {
    Machines,
  };    

  //sending Registerd User response
  res.json({
    message: "All Machine fetched Successfully ",
    data: Response,
    success: true,
  });

    }

    else if (branchId) {
      const Machines = await models.Machine.find({ isDeleted: false, "branch._branchId": branchId });
      const Response = {
        Machines,
      };

      //sending Registerd User response
      res.json({
        message: "All Machine fetched Successfully ",
        data: Response,
        success: true,
      });
    } else {
      return res.status(400).json({
        error: "Pls Provide a Valid Query",
      });
    }
 

 
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const Delete = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
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

      const Response = {
        deletedInventry,
      };

      res.json({
        message: "Machine Deleted Successfully",
        data: Response,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
