import { Router } from "express";
import Controller from "../controllers";
import Validator from "../validations";
import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";
import { validationMiddleware } from "../middleware/validator";
const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: vendor
   *   description: vendor management
   */
  app.use("/stock", route);

/**
   * @swagger
   * /:
   *   Get:
   *     tags: [vendor]
   *     summary: Getting vendor
   *     description: Getting All vendor and byId.
   */
  route.get("/",verifySuperAdmin, Controller.stock.stock);
/**
   * @swagger
   * /:
   *   Get:
   *     tags: [vendor]
   *     summary: Getting vendor
   *     description: Getting All vendor and byId.
   */
  route.post("/",verifySuperAdmin,validationMiddleware(Validator.stock.stockSchema), Controller.stock.Add)

};
