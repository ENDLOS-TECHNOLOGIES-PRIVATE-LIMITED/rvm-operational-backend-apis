import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
// const JWT_SECRET = process.env.JWT_SECRET;

import config from "../../config";

export const verifyUser = (req: any, res: Response, next: NextFunction) => {
  // Get the user from the jwt token and add id to req object

  console.log(req.header);
  const token = req.header("authtoken");
  if (!token) {
    res.status(401).send({ error: "Please Login" });
  }
  try {



    const data: any = jwt.verify(token, config.jwtSecret);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};
