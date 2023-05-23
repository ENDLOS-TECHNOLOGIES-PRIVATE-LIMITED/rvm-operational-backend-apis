import { Router, Request, Response } from 'express';
// import responseHandler from 'express-response-handler';
// import middlewares from '../middlewares';
import Controller from "../controllers";
const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: User
   *   description: User management and login
   */
  app.use('/user', route);

  /**
   * @swagger
   * /Register:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.post(
    "/register",

    Controller.User.Register
);

};
