import { Request, Response, NextFunction } from "express";
import helpers from "../helpers";
import Invetry from "../models/inventry";

interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}


export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {

    
    // Adding Inventry in the Db
    const addedInventry = await Invetry.create({
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



    const assignedInvertry = Invetry.findByIdAndUpdate(
      inventryId,
      {
        assignedTo: {
          _machine: machineId,
          date: Date.now(),
        },
        // editedBy: {
        //   _user: req.user.id,
        //   date: Date.now(),
        // },
        $push: { editedBy: { _user: req.user.id, date: Date.now() } },
      },

      { new: true }
    );

    


   const Response = {
     assignedInvertry,
   };

    // sending Registerd User response
    res.json({
      message: "Successfully Assigned Inventry",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};





