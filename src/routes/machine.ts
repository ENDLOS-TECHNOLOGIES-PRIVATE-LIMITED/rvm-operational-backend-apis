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
   *   name: Machine API
   *   description: Endpoints for managing machines.
   */
  app.use("/machine", route);

  /**
   * @swagger
   * /add :
   *   Post:
   *     tags: [Machine API]
   *     summary: Add a new machine
   *     description: Endpoint to add a new machine.
   */
  // route.post("/add", Validator.machine.validateMachine, verifySuperAdmin, Controller.machine.Add);

  route.post("/add", validationMiddleware(Validator.machine.machineSchema), verifySuperAdmin, Controller.machine.Add);

  /**
   * @swagger
   * /get:
   *   get:
   *     tags: [Machine API]
   *     summary: Get machine data
   *     description: Retrieve all machine data or specific data based on query parameters.
   */

  route.get("/get", verifySuperAdmin, Controller.machine.getAll);

  /**
   * @swagger
   * /machines:
   *   delete:
   *     tags: [Machine API]
   *     summary: Delete a machine
   */
  route.delete("/delete", verifySuperAdmin, Controller.machine.Delete);

  /**
   * @swagger
   * /machines:
   *   put:
   *     tags: [Machine API]
   *     summary: update a machine
   *     description: Endpoint to update a machine by ID.
   */

   route.put("/update", verifySuperAdmin, Controller.machine.update);
  /**
   * @swagger
   * /machines:
   *   put:
   *     tags: [Machine API]
   *     summary: assiging a machine
   *     description: Endpoint to assign a machine by ID.
   */

   route.put("/assign", verifySuperAdmin, Controller.machine.Assign);
};
