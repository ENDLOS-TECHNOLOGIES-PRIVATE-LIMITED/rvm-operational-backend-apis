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
    // Destructuring data from request
    const { email, password } = req.body;

    let isUserRegisterd = await models.Customer.findOne({ email });
    if (isUserRegisterd) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const encriptedPass = await helpers.bcryptHelper.generateHash(password);

    //Registering customoer in the Db
    const Customer = await models.Customer.create({
      ...req.body,
      password: encriptedPass,
      createdBy: {
        _user: req?.user.id,
      },
    });

    // const { password } = req.body;

    // //Registering customoer in the Db
    // const Customer = await models.Customer.create({
    //   ...req.body,
    //   createdBy: {
    //     _user: req?.user.id,
    //   },
    // });

    // console.log(Customer._id);

    // const Branch = await models.Branch.create({
    //   name: bname,
    //   customer: {
    //     _customerId: Customer._id,
    //     date: Date.now(),
    //   },
    //   createdBy: {
    //     _user: req?.user.id,
    //   },
    // });

    const Response = {
      Customer,
      // Branch,
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
export const GetAll = async (req: AuthenticatedRequest, res: Response) => {``
  try {
  
    
    //Registering customoer in the Db
    const Customer = await models.Customer.find({})

    // const PasswordDecoredPass = Customer.map(element=>{
    //   return {
    // })

    
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



