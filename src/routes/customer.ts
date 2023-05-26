import { Router, Request, Response } from "express";
import Controller from "../controllers";
import Validator from "../validations";

import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: Customer
   *   description: User management and login
   */
  app.use("/customer", route);

  /**
   * @swagger
   * /add :
   *   Post:
   *     tags: [Customer]
   *     summary: adding new Customer
   *     description: For Adding new Customer.
   */
  route.post("/add", Validator.customer.validateCustomer, verifySuperAdmin, Controller.customer.Add);

  /**
   * @swagger
   * /get :
   *   Post:
   *     tags: [Customer]
   *     summary: getting All Customers
   *     description: For getting all Customers .
   */
  route.get("/getAll", verifySuperAdmin, Controller.customer.GetAll);
  /**
   * @swagger
   * /put :
   *   Post:
   *     tags: [Customer]
   *     summary: updating  Customers
   *     description: For updating Customers .
   */
  route.put("/update", verifySuperAdmin, Controller.customer.update);
};
