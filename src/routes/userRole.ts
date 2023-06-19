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
  app.use("/userrole", route);

  /**
   * @swagger
   * /superadmin/register:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering superadmin user.
   */
  route.post("/", Validator.userRole.validateUserRole, verifySuperAdmin,Controller.userRole.add );
  /**
   * @swagger
   * /register:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.get("/",verifySuperAdmin, Controller.userRole.getAll);
  /**
   * @swagger
   * /get:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.get("/:id",verifySuperAdmin, Controller.userRole.getById);
  /**
   * @swagger
   * /update:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.put("/:id",verifySuperAdmin, Controller.userRole.update);
  /**
   * @swagger
   * /login:
   *   Post:
   *     tags: [User]
   *     summary: login user
   *     description: For Login user.
   */
  route.delete("/:id", verifySuperAdmin, Controller.userRole.deleteRole);
};
