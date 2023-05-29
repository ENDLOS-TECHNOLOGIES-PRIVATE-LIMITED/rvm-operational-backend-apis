import { Request, Response, NextFunction } from "express";
// import User from '../models/user';
import models from "../models";
import helpers from "../helpers";


interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}

export const GetByCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.query;

       if (!id) {
         res.status(400).json({
           message: "Bad Request",
           success: false,
         });
       }

       else{


    const Branches = await models.Branch.find({
      "customer._customerId": id,
      isDeleted: false,
    });
    const Customer = await models.Customer.findOne({
      _id: id,
     
    });

    const Response = {
      Customer,
      Branches,
    };

    //sending Registerd User response
    res.json({
      message: "All Branches of a Customer",
      data: Response,
      success: true,
    });

       }

  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {

const checkBranch = await models.Branch.findOne({
  "customer._customerId": req.body.customerId,
  name: req.body.name,
});

if(checkBranch){
  // The record already exists
  return res.status(409).json({ message: "Branch already exists" });
}

const Branch = await models.Branch.create({
     ...req.body,
      customer: {
        _customerId: req.body.customerId,
        date: Date.now(),
      },
      createdBy: {
        _user: req?.user.id,
      },
    });

    const Response = {
      Branch,
    };

    //sending Registerd User response
    res.json({
      message: "Branch Added Successfully ",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const Update = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let id = req.query.id;

    if (!id) {
      res.status(400).json({
        message: "Bad Request",
        success: false,
      });
    } else{
      //Upading customoer in the Db
      const updatedBranch = await models.Branch.findOneAndUpdate(
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
        updatedBranch,
      };

      //sending updated customer response
      res.json({
        message: "Branch Updated Added",
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
    } else{
      //Upading customoer in the Db
      // const deltedBranch = await models.Branch.findByIdAndDelete(
      //   {
      //     _id: id,
      //   },
      // );
      const deltedBranch = await models.Branch.findOneAndUpdate(
        {
          _id: id,
        },

        {
          $set: {
            isDeleted: true,
          },
        },

        {
          new:true
        }

      );

      const Response = {
        deltedBranch,
      };

      //sending updated customer response
      res.json({
        message: "Branch Deleted Successfully",
        data: Response,
        success: true,
      });
    }

    
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};






