import { Router, Request, Response } from "express";
import Controller from "../controllers";
import Validator from "../validations";

import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: InventryType
   *   description: Inventry management for adding InventryType
   */
  app.use("/inventrytype", route);

  /**
   * @swagger
   * /add :
   *   Post:
   *     tags: [InventryType]
   *     summary: adding new inventryType
   *     description: For Adding new inventryType.
   */
  route.post("/add", Validator.invetryType.validateInventryType, verifySuperAdmin, Controller.inventryType.Add);

  /**
   * @swagger
   * /put :
   *   Post:
   *     tags: [InventryType]
   *     summary: updating  InventryType
   *     description: For updating InventryType .
   */
  route.put("/update", verifySuperAdmin, Controller.inventryType.update);

  /**
   * @swagger
   * /get :
   *   Post:
   *     tags: [InventryType]
   *     summary: getting InventryType
   *     description: For getting all InventryType.
   */
  route.get("/getAll", verifySuperAdmin, Controller.inventryType.GetAll);

  /**
   * @swagger
   * /get :
   *   Post:
   *     tags: [InventryType]
   *     summary: getting InventryType
   *     description: For getting particuller InventryType .
   */
  route.get("/get", verifySuperAdmin, Controller.inventryType.Get);

  /**
   * @swagger
   * /delete :
   *   Post:
   *     tags: [InventryType]
   *     summary: deleting  InventryType
   *     description: For deleting InventryType .
   */
  route.delete("/delete", verifySuperAdmin, Controller.inventryType.Delete);
};
