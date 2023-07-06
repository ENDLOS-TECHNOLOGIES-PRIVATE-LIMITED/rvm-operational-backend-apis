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
   *   name: User
   *   description: User management and login
   */
  app.use("/ticket", route);

  /**
   * @swagger
   * /superadmin/register:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering superadmin user.
   */
  route.post("/",validationMiddleware( Validator.ticket.ticketSchema), verifySuperAdmin,Controller.ticket.add );
  /**
   * @swagger
   * /register:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.get("/",verifySuperAdmin, Controller.ticket.getAll);
  /**
   * @swagger
   * /update:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.put("/:id",verifySuperAdmin, Controller.ticket.update);

};
