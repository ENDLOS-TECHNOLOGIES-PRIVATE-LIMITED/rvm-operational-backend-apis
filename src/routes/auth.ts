import { Router } from 'express';
import Controller from "../controllers";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);
/**
   * @swagger
   * /register:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering user.
   */
  route.post(
    "/refreshtoken",

    Controller.Auth.RefreshToken
  );
};
