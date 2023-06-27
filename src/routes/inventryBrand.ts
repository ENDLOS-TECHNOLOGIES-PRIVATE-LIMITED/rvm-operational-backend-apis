import { Router, Request, Response } from "express";
import Controller from "../controllers";
import Validator from "../validations";
import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";
const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: vendor
   *   description: vendor management
   */
  app.use("/inventrybrand", route);

  /**
   * @swagger
   * /:
   *   Post:
   *     tags: [inventrybrand]
   *     summary: Adding inventrybrand
   *     description: Adding inventrybrand.
   */
  route.post("/", Validator.inventryBrand.validateInventryBrandSchema, verifySuperAdmin,Controller.inventryBrand.add );




  /**
   * @swagger
   * /:
   *   Get:
   *     tags: [vendor]
   *     summary: Getting vendor
   *     description: Getting All vendor and byId.
   */
  route.get("/",verifySuperAdmin, Controller.inventryBrand.getAll);

  /**
   * @swagger
   * /update:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.put("/:id",verifySuperAdmin, Controller.inventryBrand.update);
  /**
   * @swagger
   * /login:
   *   Post:
   *     tags: [User]
   *     summary: login user
   *     description: For Login user.
   */
  route.delete("/:id", verifySuperAdmin, Controller.inventryBrand.deleteBrand);
};
