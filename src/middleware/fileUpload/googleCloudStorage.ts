import { Storage } from "@google-cloud/storage";
import multer from "multer";

const storage = new Storage({
    keyFilename: "path/to/keyfile.json", // Path to your JSON key file
    projectId: "your-project-id", // Your Google Cloud project ID
  });


  const bucketName = "your-bucket-name"; // Name of your GCS bucket

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});


// const gcpupload = (req, res, next) => {
//     const file = req.file;
  
//     if (!file) {
//       res.status(400).send("No file uploaded.");
//       return;
//     }
  
//     const blob = storage.bucket(bucketName).file(file.originalname);
  
//     const blobStream = blob.createWriteStream({
//       metadata: {
//         contentType: file.mimetype,
//       },
//     });
  
//     blobStream.on("error", (err) => next(err));
  
//     blobStream.on("finish", () => {
//       res.status(200).send("File uploaded successfully.");
//     });
  
//     blobStream.end(file.buffer);
//   }


  const gcp = (upload.array('files'), (req, res, next) => {
    const files = req.files;
  
    if (!files || files.length === 0) {
      res.status(400).send('No files uploaded.');
      return;
    }
  
    const uploadPromises = files.map((file) => {
      const blob = storage.bucket(bucketName).file(file.originalname);
  
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
  
      blobStream.on('error', (err) => {
        console.error(err);
        next(err);
      });
  
      return new Promise((resolve, reject) => {
        blobStream.on('finish', () => {
          resolve();
        });
  
        blobStream.end(file.buffer);
      });
    });
  
    Promise.all(uploadPromises)
      .then(() => {
        res.status(200).send('Files uploaded successfully.');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Upload failed.');
      });
  });
  