import multer from 'multer';

// Create a Multer storage engine
const storage = multer.memoryStorage();

// Configure Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Set a file size limit (optional)
  },
});

// Custom middleware for handling file upload
const multeruploader = upload.array('files'); // Change 'files' to your desired field name

export default multeruploader;
