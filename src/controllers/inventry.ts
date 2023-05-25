import { Request, Response, NextFunction } from "express";
import helpers from "../helpers";
import models from "../models";
// import Invetry from "../models/inventry";




interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}


export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {

    

    
    // Adding Inventry in the Db
    const addedInventry = await models.Inventory.create({
      ...req.body,
      createdBy: {
        _user: req?.user.id,
      },
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
export const assign = async (req: AuthenticatedRequest, res: Response) => {
  try {

    let { inventryId,machineId } = req.body;



    // const assignedInvertry = Invetry.findByIdAndUpdate(
    //   inventryId,
    //   {
    //     assignedTo: {
    //       _machine: machineId,
    //       date: Date.now(),
    //     },
    //     // editedBy: {
    //     //   _user: req.user.id,
    //     //   date: Date.now(),
    //     // },
    //     $push: { editedBy: { _user: req.user.id, date: Date.now() } },
    //   },

    //   { new: true }
    // );

    


  //  const Response = {
  //    assignedInvertry,
  //  };

    // sending Registerd User response
    // res.json({
    //   message: "Successfully Assigned Inventry",
    //   data: Response,
    //   success: true,
    // });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const get = async (req: AuthenticatedRequest, res: Response) => {
  try {

    let { inventryId,machineId } = req.body;

    let {type} = req.query

 if(type=="all"){
      const allInventry = await models.Inventory.find();

       const Response = {
         allInventry,
       };

      // sending All Inventry 
      res.json({
        message: "Successfully get All Inventry",
        data: Response,
        success: true,
      });
    }

    else{

   res.json({
     message: "Pls provide correct query",
    success: true,
   });



    }


} catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};






