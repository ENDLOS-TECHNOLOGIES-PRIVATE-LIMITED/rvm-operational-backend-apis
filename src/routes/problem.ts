import { Router, Request, Response } from "express";
import Controller from "../controllers";
import Validator from "../validations";

import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";

const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: Machine API
   *   description: Endpoints for managing machines.
   */
  app.use("/problem", route);

  /**
   * @swagger
   * /add :
   *   Post:
   *     tags: [Machine API]
   *     summary: Add a new machine
   *     description: Endpoint to add a new machine.
   */



  
  route.post("/", Validator.problem.validateProblem, verifySuperAdmin, Controller.problem.Add);



  
  /**
   * @swagger
   * /get:
   *   get:
   *     tags: [Machine API]
   *     summary: Get machine data
   *     description: Retrieve all machine data or specific data based on query parameters.
   */

  route.get("/getAll", verifySuperAdmin, Controller.problem.getAll);

  /**
   * @swagger
   * /machines:
   *   delete:
   *     tags: [Machine API]
   *     summary: Delete a machine
   */
  route.delete("/:id", verifySuperAdmin, Controller.problem.Delete);

  /**
   * @swagger
   * /machines:
   *   put:
   *     tags: [Machine API]
   *     summary: update a machine
   *     description: Endpoint to update a machine by ID.
   */

   route.put("/:id", verifySuperAdmin, Controller.problem.update);


};
