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


         const inventryAvailability = await models.Machine.find({
           "inventry._inventry": { $in: inventryIds },
         }).exec();


        //  console.log({ inventryAvailability2 });

        //  console.log({inventryIds});









         //chekding inventry which provided by user are assigned to another machine or not
        //  const inventryAvailability = await models.Inventory.aggregate([
        //    {
        //      $match: {
        //        //  _id: { $in: inventryIds },
        //        _id: { $in: inventry },
        //      },
        //    },
        //     {
        //       $lookup: {
        //         from: "machines",
        //         localField: "_id",
        //         foreignField: "inventry._inventry",
        //         as: "machines",
        //       },
        //     },
        //     {
        //       $unwind: "$machines",
        //     },
        //     {
        //       $unwind: "$machines.inventry",
        //     },
        //     {
        //       $project: {
        //         _inventry: "$machines.inventry._inventry",
        //         isAvailable: {
        //           $eq: ["$machines.inventry._inventry", null],
        //         },
        //       },
        //     },
        //  ]).exec();




         console.log({ inventryAvailability });

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
      // Adding Machine in the Db
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

    
  const Response = {
    // Machines,
    AllMachines
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
    
    // else {
      
    //   const MachineAlreadyAssigned = await models.Machine.findOne({_id: machineId });

    //   if(MachineAlreadyAssigned?.branchId){
    //      res.status(400).json({
    //        message: "Machine Already Assigned",
    //        success: false,
    //      });

    //   }else{
    //     // Assigning Machine 
    //     const assignedMachine = await models.Machine.findOneAndUpdate(
    //       {
    //         _id: new mongoose.Types.ObjectId(machineId.toString()),
            
    //       },
    //       {
    //         $set: {
    //           branchId: req.body.branchId,
    //         },
    //       },

    //       {
    //         new: true,
    //       }
    //     );

    //     const Response = {
    //       assignedMachine,
    //     };

    //     //sending updated Inventory response
    //     res.json({
    //       message: "Machine Assigned Successfully",
    //       data: Response,
    //       success: true,
    //     });
    //   }

 
    
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

      //  if (isSerialExist ) {
      //       return res.status(400).json({ error: "SerialNumber already exist" });
      //     }



      //Upading Machine in the Db
      // const updatedMachine = await models.Machine.findOneAndUpdate(
      //   {
      //     _id: id,
      //   },
      //   {
      //     $set: {
      //       ...req.body,
      //     },
      //   },

      //   {
      //     new: true,
      //   }
      // );

      // const Response = {
      //   updatedMachine,
      // };

      // //sending updated Inventory response
      // res.json({
      //   message: "Machine Updated Successfully",
      //   data: "Response",
      //   success: true,
      // });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};