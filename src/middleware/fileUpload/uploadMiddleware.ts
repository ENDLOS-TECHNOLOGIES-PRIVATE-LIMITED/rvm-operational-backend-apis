import multer from "multer";
import path from "path";


// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  cb(null, path.join(__dirname, '..', '..', 'uploads')); // Specify the directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadMiddleware = (req, res, next) => {

  // console.log({req:req.body});

const upload = multer({ storage }).array("files", 10);
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during file upload
      res.status(400).send("Multer error: " + err.message);
    } else if (err) {
      // An unknown error occurred during file upload
      res.status(500).send("Unknown error occurred: " + err.message);
    } else if (!req.files || req.files.length === 0) {
      // No files were uploaded
      res.status(400).send("No files uploaded.");
    } else {
      // File upload was successful
      next();
    }
  });
};

// module.exports = uploadMiddleware;

export default uploadMiddleware;
