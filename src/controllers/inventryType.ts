import { Request, Response, NextFunction } from "express";
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

// const InvetryTypeIsExist = await models.InvetryType.find({name:req.body.name,isDeleted:false})

const InvetryTypeIsExist = await models.InvetryType.find({
  name: { $regex: new RegExp("^" + req.body.name, "i") },
  isDeleted: false,
});

console.log({ InvetryTypeIsExist });


if(InvetryTypeIsExist.length>0){
   return res.status(400).json({ error: "Inventry Type already exist" });
}

else{
  //Adding inventry type in the Db
  const Customer = await models.InvetryType.create({
    ...req.body,
  });

  const Response = {
    Customer,
  };

  //sending Registerd User response
  res.json({
    message: "InventryType Added Successfully ",
    data: Response,
    success: true,
  });
}

    
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const GetAll = async (req: AuthenticatedRequest, res: Response) => {
  try {
  

    const {type} = req.query;


    if(type=='allInventries'){

   
        const InventryTypes = await models.InvetryType.aggregate([
          { $match: { isDeleted: false } }, // Filter customers with isDelete set to false
          { $sort: { createdAt: -1 } },
          {
            $lookup: {
              from: "invetries",
              localField: "_id",
              foreignField: "inventryType",
              as: "invetries",
            },
          },
          {
            $addFields: {
              Count: { $size: "$invetries" },
            },
          },
        ]).exec();


        

        console.log({InventryTypes});


       const Response = {
         InventryTypes,
       };

       //sending Registerd User response
       res.json({
         message: "InventryTypes fetched Successfully ",
         data: Response,
         success: true,
       });
      

    }

    else {

         const InventryTypes = await models.InvetryType.find({ isDeleted: false });

         const Response = {
           InventryTypes,
         };

         //sending Registerd User response
         res.json({
           message: "InventryTypes fetched Successfully ",
           data: Response,
           success: true,
         });


    }

 
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const Get = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let {id,type} = req.query;

    if (!id) {
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
    }
    else if(type=='allInventries'){
 const InventryTypes = await models.InvetryType.aggregate([
   { $match: { isDeleted: false, _id: new mongoose.Types.ObjectId(id.toString()) } }, // Filter customers with isDelete set to false
   { $sort: { createdAt: -1 } },
   {
     $lookup: {
       from: "invetries",
       localField: "_id",
       foreignField: "inventryType",
       as: "invetries",
     },
   },
 ]).exec();

 if(InventryTypes.length>0){
 const Response = {
   InventryTypes,
 };

 //sending Registerd User response
 res.json({
   message: "InventryTypes fetched Successfully ",
   data: Response,
   success: true,
 });
      
 }

 else{
   res.status(404).json({ error: "No Result found" });
 }


      
    }
    
    else {

     
      const invetryType = await models.InvetryType.findOne({
        _id: id,
      });

      const Response = {
        invetryType,
      };
    res.json({
      message: "invetryType fetched Successfully",
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
      //Upading customoer in the Db
      const updatedInventryType = await models.InvetryType.findOneAndUpdate(
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
        updatedInventryType,
      };

      //sending updated customer response
      res.json({
        message: "InventryType Updated Successfully",
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
    let id = req.query.id;

    if (!id) {
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
    } else {
  

      const deletedInventryType = await models.InvetryType.findOneAndUpdate(
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

      const AllInventries = await models.Inventory.updateMany({ inventryType :id},{isDeleted:true},{new:true});

      console.log({AllInventries});

      const Response = {
        deletedInventryType,
        AllInventries,
      };

      res.json({
        message: "InventryType Deleted Successfully",
        data: Response,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
