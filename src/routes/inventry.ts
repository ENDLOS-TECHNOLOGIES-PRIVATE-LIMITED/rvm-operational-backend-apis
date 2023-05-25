import { Router, Request, Response } from "express";
import Controller from "../controllers";
import Validator from "../validations";

import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: User
   *   description: User management and login
   */
  app.use("/inventry", route);

  /**
   * @swagger
   * /add :
   *   Post:
   *     tags: [Inventry]
   *     summary: adding new inventry
   *     description: For Adding new inventry.
   */
  route.post("/add", Validator.inventry.validateInventry, verifySuperAdmin, Controller.inventry.Add);

  /**
   * @swagger
   * /get :
   *   Post:
   *     tags: [Inventry]
   *     summary: getting inventry
   *     description: For getting all and custom inventry as per query .
   */
  route.get("/get", verifySuperAdmin, Controller.inventry.get);
};
