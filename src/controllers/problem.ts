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

    const { type, branchId } = req.query;

   
  
      const problems = await models.problem.find({})
    
    // const AllMachines = await models.Machine.aggregate([
      
    //   { $match: { isDeleted: false } }, // Filter machines with isDeleted set to false
    //   // { $unwind: '$inventry' }, // Unwind the inventory array
    //   {
    //     $lookup: {
    //       from: 'invetries',
    //       localField: 'inventry._inventry',
    //       foreignField: '_id',
    //       as: 'inventoryDetails'
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'branches',
    //       localField: 'branchId',
    //       foreignField: '_id',
    //       as: 'branch'
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: 'customers',
    //       localField: 'branch.customer._customerId',
    //       foreignField: '_id',
    //       as: 'customer'
    //     }
    //   },

    //   {
    //     $unwind: "$inventoryDetails"
    //   },
    

    //   {
    //     $group: {
    //       _id: '$_id',
    //       machineId: { $first: '$machineId' },
    //       branch: {
    //         $first: { $arrayElemAt: ["$branch", 0] }
    //       },
    //       customer: {
    //         $first: { $arrayElemAt: ["$customer", 0] }  
    //       },
    //       warrentyStartDate: { $first: '$warrentyStartDate' },
          
    //         inventoryDetails: {
    //         $push: "$inventoryDetails"
    //       }

    //     },
        
    //   },
    //   {
    //     $project: {
    //       machineId:"$machineId",
    //       warrentyStartDate:"$warrentyStartDate",
    //       branch: {
    //         name: "$branch.name",
    //         _id: "$branch._id"
    //       },
    //       customer: {
    //         name: "$customer.name",
    //         _id: "$customer._id"
    //       },
    //       inventoryDetails:"$inventoryDetails"
    //     }
    //   }
     
    // ]);

    
  const Response = {
    // Machines,
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


export const Assign = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let {branchId} = req.body;

    let {machineId}=req.query;

    if ((!machineId || !branchId)) {
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
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


        const Response = {
          assignedMachine,
        };

        //sending updated Inventory response
        res.json({
          message: "Machine Assigned Successfully",
          data: Response,
          success: true,
        });
      


    }
    
  
    
    // }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
    } else {
      // checking the serila number exist or not
        const isMachineIdExist = await models.Machine.findOne({ machineId: req.body.machineId });

        // // res.send(isSerialExist)

        console.log({ isMachineIdExist });

        console.log(isMachineIdExist?._id);
        // console.log(id);

        if (isMachineIdExist&& isMachineIdExist?._id.toString() !== id) {
          res.status(409).send({
            message: "Machine ID is already reserved for another machine",
          });
        } else {
          console.log({ id });
          // Upading Machine in the Db
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

          const Response = {
            updatedMachine,
          };

          //sending updated Inventory response
          res.json({
            message: "Machine Updated Successfully",
            data: Response,
            success: true,
          });
        }

     
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};