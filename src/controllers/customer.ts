import { Request, Response, NextFunction } from "express";
// import User from '../models/user';
import models from "../models";
import helpers from "../helpers";
import { date } from "yup";

interface AuthenticatedRequest extends Request {
  user?: {
    id: String;
    role: String;
  };
}


export const Add = async (req: AuthenticatedRequest, res: Response) => {
  try {

    //Registering customoer in the Db
    const Customer = await models.Customer.create({
      ...req.body,
      createdBy: {
        _user: req?.user.id,
      },
    });


    const Response = {
      Customer,
   };

    //sending Registerd User response
    res.json({
      message: "Customer Added Successfully ",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};
export const GetAll = async (req: AuthenticatedRequest, res: Response) => {
  try {
const AllCustomer = await models.Customer.aggregate([
      { $match: { isDeleted: false } }, // Filter customers with isDelete set to false
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "branches",
          localField: "_id",
          foreignField: "customer._customerId",
          as: "branches",
        },
      },
    ]).exec();
     
   
    const Response = {
      // Customer,
      Customer: AllCustomer,
    };

    //sending Registerd User response
    res.json({
      message: "Customer fetched Successfully ",
      data: Response,
      success: true,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  } 
};

export const Get = async (req: AuthenticatedRequest, res: Response) => {
  try {
   
    let id = req.query.id;

   



    if (!id) {
    res.status(400).json({
      message: "Bad Request",
      success: false,
    });
    } else{
      //Upading customoer in the Db
      const Customer = await models.Customer.findOne(
        {
          _id: id,
        },
        
      );

      const Response = {
        Customer,
      };

      //sending updated customer response
      res.json({
        message: "Customer Updated Successfully",
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
    } else{
      //Upading customoer in the Db
      const updatedCustomer = await models.Customer.findOneAndUpdate(
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
        updatedCustomer,
      };

      //sending updated customer response
      res.json({
        message: "Customer Updated Successfully",
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
      //Upading customoer in the Db
      // const deltedBranch = await models.Branch.findByIdAndDelete(
      //   {
      //     _id: id,
      //   },
      // );
      const deletedCustomer = await models.Customer.findOneAndUpdate(
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
        deletedCustomer,
      };

      //sending updated customer response
      res.json({
        message: "Customer Deleted Successfully",
        data: Response,
        success: true,
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};

