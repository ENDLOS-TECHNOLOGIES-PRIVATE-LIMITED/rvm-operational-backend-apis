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
     const solution = await models.solution.create({
        ...req.body,

       
       });

      const Response = {
        solution,
      };

      //sending Registerd User response
      res.json({
        message: "Solution Added Successfully ",
        data: Response,
        success: true,
      });
    
    

  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};



