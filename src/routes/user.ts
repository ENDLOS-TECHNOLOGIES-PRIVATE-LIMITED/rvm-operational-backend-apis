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
  app.use("/user", route);

  // /**
  //  * @swagger
  //  * /superadmin/register:
  //  *   Post:
  //  *     tags: [User]
  //  *     summary: Register user
  //  *     description: Registering superadmin user.
  //  */
  // route.post("/superadmin/register", Validator.userValidataion.validateRegisterUser, Controller.User.SuperAdminRegister);
  /**
   * @swagger
   * /register:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.post("/register", Validator.userValidataion.validateRegisterUser, verifySuperAdmin, Controller.User.Register);
  /**
   * @swagger
   * /login:
   *   Post:
   *     tags: [User]
   *     summary: login user
   *     description: For Login user.
   */
  route.post("/login", Validator.userValidataion.validateLoginUser, Controller.User.Login);
  /**
   * @swagger
   * /getAll:
   *   get:
   *     tags: [User]
   *     summary: get all user
   *     description: For getting All user.
   */
  route.get("/getAll", verifySuperAdmin, Controller.User.getAll);
  /**
   * @swagger
   * /:id:
   *   delete:
   *     tags: [User]
   *     summary: deleting a  user
   *     description: For softdelete a  user.
   */
  route.delete("/:id", verifySuperAdmin, Controller.User.deleteUser);
  /**
   * @swagger
   * /:id:
   *   put:
   *     tags: [User]
   *     summary: updating a  user
   *     description: For updating a  user.
   */
  route.put("/:id", verifySuperAdmin, Controller.User.update);
};
