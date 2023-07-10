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
  app.use("/localvendor", route);

  /**
   * @swagger
   * /:
   *   Post:
   *     tags: [vendor]
   *     summary: Register vendor
   *     description: Registering vendor.
   */
  route.post("/", validationMiddleware(Validator.localVendor.localVendorValidationSchema), verifySuperAdmin,Controller.localVendor.add );
  /**
   * @swagger
   * /:
   *   Get:
   *     tags: [vendor]
   *     summary: Getting vendor
   *     description: Getting All vendor and byId.
   */
  route.get("/",verifySuperAdmin, Controller.localVendor.getAll);

  /**
   * @swagger
   * /update:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.put("/:id",verifySuperAdmin, Controller.localVendor.update);
  /**
   * @swagger
   * /login:
   *   Post:
   *     tags: [User]
   *     summary: login user
   *     description: For Login user.
   */
  route.delete("/:id", verifySuperAdmin, Controller.localVendor.deleteVendor);


  

};
