import { Router, Request, Response } from "express";
import Controller from "../controllers";
import Validator from "../validations";
import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";
import gcsFileUploader from "../middleware/fileUpload/gcsFileUploader";
import multeruploader from "../middleware/fileUpload/multerForGcs";
const multer = require('multer');
const route = Router();

// Create a Multer storage engine
const storage = multer.memoryStorage();


// Configure Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Set a file size limit (optional)
  },
});



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
  
  route.post("/",verifySuperAdmin,multeruploader,gcsFileUploader, Controller.solution.Add );
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
  
  route.put("/:id",verifySuperAdmin,multeruploader,gcsFileUploader, Controller.solution.Update );
}