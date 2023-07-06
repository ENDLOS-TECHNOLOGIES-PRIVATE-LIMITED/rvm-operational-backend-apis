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


// const generateFieldName = (index) => `solutions[${index}][image]`;
const generateFieldName = (index) => `solution[${index}][image]`;

  const multerUploader = upload.fields([
  { name: generateFieldName(0), maxCount: 1 },
  { name: generateFieldName(1), maxCount: 1 },
  { name: generateFieldName(2), maxCount: 1 },
  { name: generateFieldName(4), maxCount: 1 },
  { name: generateFieldName(5), maxCount: 1 },
  { name: generateFieldName(6), maxCount: 1 },
  { name: generateFieldName(7), maxCount: 1 },
  { name: generateFieldName(8), maxCount: 1 },
  { name: generateFieldName(9), maxCount: 1 },
  { name: generateFieldName(10), maxCount: 1 },
  // Add more fields for each array index as needed
]);



export default multerUploader;




