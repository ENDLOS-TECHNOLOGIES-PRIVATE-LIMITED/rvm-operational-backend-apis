import { Router, Request, Response } from "express";
import Controller from "../controllers";
import Validator from "../validations";

import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";
import { validationMiddleware } from "../middleware/validator";

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: Customer
   *   description: User management and login
   */
  app.use("/branch", route);

  /**
   * @swagger
   * /add :
   *   Post:
   *     tags: [Branch]
   *     summary: adding new branch
   *     description: For Adding new branch.
   */
  route.post("/add", validationMiddleware(Validator.branch.branchSchema), verifySuperAdmin, Controller.branch.Add);

  /**
   * @swagger
   * /getbycustomer :
   *   Post:
   *     tags: [Branch]
   *     summary: Getting All Branches of a Customer
   *     description: For All Branches of a Customer .
   */
  route.get("/getbycustomer", verifySuperAdmin, Controller.branch.GetByCustomer);
  /**
   * @swagger
   * /getbycustomer :
   *   Post:
   *     tags: [Branch]
   *     summary: Getting All Branches of a Customer
   *     description: For All Branches of a Customer .
   */
  route.get("/", verifySuperAdmin, Controller.branch.getAll);


  
  /**
   * @swagger
   * /put :
   *   Post:
   *     tags: [Branch]
   *     summary: updating  Branch
   *     description: For updating Branch .
   */
  route.put("/update", verifySuperAdmin, Controller.branch.Update);

  /**
   * @swagger
   * /delete :
   *   Post:
   *     tags: [Branch]
   *     summary: updating  Branch
   *     description: For updating Branch .
   */
  route.delete("/delete", verifySuperAdmin, Controller.branch.Delete);
};
