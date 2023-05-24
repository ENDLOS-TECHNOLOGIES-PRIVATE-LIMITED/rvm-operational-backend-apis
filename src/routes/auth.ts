import { Router } from 'express';
// import middlewares from '../middlewares';
// import Validation from '../validations';
// import Controller from '../controllers';
import Controller from "../controllers";

const route = Router();

export default (app: Router) => {
  app.use("/auth", route);

  route.get("/checkAuth", (req, res) => {
    res.send("Checking Auth Route");
  });

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
