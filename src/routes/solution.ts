import { Router, Request, Response } from "express";
import Controller from "../controllers";
import Validator from "../validations";
import { verifySuperAdmin } from "../middleware/auth/verifySuperAdmin";
import uploadGcsMiddleware from "../middleware/fileUpload/multerForGcs";
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
   * /superadmin/register:
   *   Post:
   *     tags: [User]
   *     summary: Register user
   *     description: Registering superadmin user.
   */
  
  route.post("/",verifySuperAdmin,upload.array('files'),uploadGcsMiddleware, Controller.solution.Add );
  /**
   * @swagger
   * /:
   *   get:
   *     tags: [Solution]
   *     summary: Getting All Solutions
   *     description:  Getting All Solutions byid , byProblemId or All Solution.
   */
  
  route.get("/",verifySuperAdmin, Controller.solution.getAll );
}