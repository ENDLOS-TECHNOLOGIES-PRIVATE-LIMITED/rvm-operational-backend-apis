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
  
    
const Customer = await models.Customer.find({})

    const Response = {
      Customer,
    };

    //sending Registerd User response
    res.json({
      message: "Customer Successfully Added",
      data: Response,
      success: true,
    });
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



