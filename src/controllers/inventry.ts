import { Request, Response, NextFunction } from "express";
import helpers from "../helpers";
import models from "../models";
import mongoose from "mongoose";
// import Invetry from "../models/inventry";

interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}


export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {

    // checking the serila number exist or not 
    const isSerialExist = await models.Inventory.find({ serialNumber: req.body.serialNumber });
    if (isSerialExist.length > 0) {
      return res.status(400).json({ error: "SerialNumber already exist" });
    }

   

    // Adding Inventry in the Db
    const addedInventry = await models.Inventory.create({
     ...req.body,
     });

   const Response = {
     addedInventry,
   };
  

    // sending Registerd User response
    res.json({
      message: "Successfully Added Inventry",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
// export const assign = async (req: AuthenticatedRequest, res: Response) => {
//   try {

//     let { inventryId,machineId } = req.body;




//     const assignedInventories = await models.Inventory.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(inventryId.toString()),
//           assignedTo: { $exists: true },
//         },
//       },
//     ]);

//     console.log(assignedInventories);


//     if(assignedInventories.length>0){

//        return res.status(400).json({ error: "Inventry already Assigned to a Machine" });

//     }





    
//     const assignedInvertry = await models.Inventory.findByIdAndUpdate(
//       inventryId,
//       {
//         assignedTo: {
//           _machine: machineId,
//           date: Date.now(),
//         },
//        },

//       { new: true }
//     );

    


//    const Response = {
//      assignedInvertry,
//    };

//     // sending Registerd User response
//     res.json({
//       message: "Successfully Assigned Inventry",
//       data: Response,
//       success: true,
//     });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message, success: false });
//   }
// };
export const get = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let { type, inventryTypeId } = req.query;
    if(type=='unassigned'){
      //chekding inventry which provided by user are assigned to another machine or not
      const unAssignedInventry = await models.Inventory.aggregate([
        {
          $match: {
            isDeleted: false,
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
          $lookup: {
            from: "machines",
            localField: "_id",
            foreignField: "inventry._inventry",
            as: "assignedMachines",
          },
        },
        {
          $match: {
            assignedMachines: { $size: 0 },
          },
        },
        
        {
          $project: {
            _id: 1,
            inventryType: 1,
            brandName: 1,
            serialNumber: 1,
            isDeleted: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1,
          },
        },
      ]);


      // const allInventry = await models.Inventory.aggregate([
      //   {
      //     $match: {
      //       isDeleted: false,
      //       assignedTo: { $exists: false },
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "invetrytypes", // Replace "inventoryTypes" with the actual name of your inventory types collection
      //       localField: "inventryType",
      //       foreignField: "_id",
      //       as: "inventoryType",
      //     },
      //   },
      //   {
      //     $unwind: "$inventoryType",
      //   },
      //   {
      //     $addFields: {
      //       inventryType: "$inventoryType.name",
      //     },
      //   },
      //   {
      //     $project: {
      //       inventoryType: 0,
      //     },
      //   },
      // ]);

      const Response = {
        // allInventry,
        unAssignedInventry,
      };

      // sending All Inventry
      res.json({
        message: "Successfully get All Inventry",
        data: Response,
        success: true,
      });
    }

    else if (type == "all") {
    
      const allInventry = await models.Inventory.aggregate([
        {
          $match: {
           isDeleted:false
          },
        },
        {
          $lookup: {
            from: "invetrytypes", // Replace "inventoryTypes" with the actual name of your inventory types collection
            localField: "inventryType",
            foreignField: "_id",
            as: "inventoryType",
          },
        },
        {
          $unwind: "$inventoryType",
        },
        {
          $addFields: {
            inventryType: "$inventoryType.name",
            inventryId: "$inventoryType._id",
          },
        },
        {
          $project: {
            inventoryType: 0,
          },
        },
      ]);

      const Response = {
        allInventry,
     
      };

      // sending All Inventry
      res.json({
        message: "Successfully get All Inventry",
        data: Response,
        success: true,
      });
    } else if (inventryTypeId) {
      const filterdInventory = await models.Inventory.aggregate([
        { $match: { inventryType: new mongoose.Types.ObjectId(inventryTypeId.toString()), isDeleted: false } },

        {
          $lookup: {
            from: "invetrytypes", // Replace "inventoryTypes" with the actual name of your inventory types collection
            localField: "inventryType",
            foreignField: "_id",
            as: "inventoryType",
          },
        },
        {
          $unwind: "$inventoryType",
        },
        {
          $addFields: {
            inventryType: "$inventoryType.name",
          },
        },
        {
          $project: {
            inventoryType: 0,
          },
        },
      ]);

      const Response = {
        filterdInventory,
      };

      // sending All Inventry
      res.json({
        message: "Successfully get All Inventry",
        data: Response,
        success: true,
      });
    } else {
      res.json({
        message: "Pls provide correct query",
        success: true,
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
      const deletedInventry = await models.Inventory.findOneAndUpdate(
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
        message: "Inventry Deleted Successfully",
        data: Response,
        success: true,
      });
    }
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
    //   const isSerialExist = await models.Inventory.findOne({ serialNumber: req.body.serialNumber,_id:id });

    //  if (isSerialExist ) {
    //       return res.status(400).json({ error: "SerialNumber already exist" });
    //     }

      //Upading Inventory in the Db
      const updatedInventry = await models.Inventory.findOneAndUpdate(
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

      const Response = {
        updatedInventry,
      };

      //sending updated Inventory response
      res.json({
        message: "Inventory Updated Successfully",
        data: Response,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};



