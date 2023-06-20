import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;

import config from "../../config";
import helpers from "../../helpers";

export const verifySuperAdmin = (req: any, res: Response, next: NextFunction) => {
  // Get the user from the jwt token and add id to req object
const token = req.headers.authorization;

  if (!token) {
    res.status(401).send({ error: "Please Login" });
  }
  try {
    const user: any = helpers.jwtHelper.verifyAccessToken(token);

  
    if (user.role.toLowerCase() !== "superadmin") {
      throw new Error("'Unauthorized: Insufficient permissions to perform this operation.'");
    }
      
      
      req.user = user;


    console.log({ user });
    next();
  } catch (error) {

    console.log(error);
    res.status(401).send({ error:error.message });
  }
};
