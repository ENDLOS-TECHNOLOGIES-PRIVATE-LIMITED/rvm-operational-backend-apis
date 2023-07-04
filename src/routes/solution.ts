import { Router } from "express";
import Controller from "../controllers";
import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";
import gcsFileUploader from "../middleware/fileUpload/gcsFileUploader";
import multerUploader from "../middleware/fileUpload/multerForGcs";
import Validator from "../validations";
import { validationMiddleware } from "../middleware/validator";
const route = Router();

export default (app: Router) => {
  /**
   * @swagger
   * tags:
   *   name: User
   *   description: User management and login
   */
  app.use("/solution", route);

  /**
   * @swagger
   * /solution/:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering superadmin user.
   */
  
  // route.post("/",verifySuperAdmin,validationMiddleware(Validator.solution.solutionSchema),multerUploader,gcsFileUploader, Controller.solution.Add );
  route.post("/",verifySuperAdmin,multerUploader,gcsFileUploader, Controller.solution.Add );

  /**
   * @swagger
   * /solution/:
   *   get:
   *     tags: [Solution]
   *     summary: Getting All Solutions
   *     description:  Getting All Solutions byid , byProblemId or All Solution.
   */
  
  route.get("/",verifySuperAdmin, Controller.solution.getAll );
  /**
   * @swagger
   * /solution/:
   *   delete:
   *     tags: [Solution]
   *     summary: Getting All Solutions
   *     description:  Getting All Solutions byid , byProblemId or All Solution.
   */
  
  route.delete("/:id",verifySuperAdmin, Controller.solution.Delete );
  /**
   * @swagger
   * /Solution/:
   *   get:
   *     tags: [Solution]
   *     summary: Upadint a Solutions
   *     description:  Updating a Solution.
   */
  
  route.put("/:id",verifySuperAdmin,multerUploader,gcsFileUploader, Controller.solution.Update );
}