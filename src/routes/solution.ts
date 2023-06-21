import { Router, Request, Response } from "express";
import Controller from "../controllers";
import Validator from "../validations";
import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";
import uploadMiddleware from '../middleware/fileUpload/uploadMiddleware'

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: User
   *   description: User management and login
   */
  app.use("/solution", route);

  /**
   * @swagger
   * /superadmin/register:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering superadmin user.
   */
  route.post("/",uploadMiddleware, (req,res)=>{

    // req.files

    console.log(req.files);

    // console.log("file is req object",req);

    res.send("req")



  } );
}