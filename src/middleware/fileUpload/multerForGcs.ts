// const multer = require('multer');
const { Storage } = require('@google-cloud/storage');


// Create a Multer storage engine
// const storage = multer.memoryStorage();




  const gstorage = new Storage({
    // keyFilename: "path/to/keyfile.json", // Path to your JSON key file
    keyFilename: "mykey.json", // Path to your JSON key file
    projectId: "endlos-studio-website", // Your Google Cloud project ID
  });


  const bucketName = "rvmoperationadditionalbucket"; // Name of your GCS bucket



// export default uploadGcsMiddleware;
const uploadGcsMiddleware =async (req, res, next) => {

    // console.log(req.files);

    if (!req.files || req.files.length === 0) {
        res.status(400).send('No files uploaded.');
        return;
      }
    
      const uploadPromises = req.files.map(async (file) => {

        const gcsFileName = `${Date.now()}-${file.originalname}`;

        const bucket = gstorage.bucket(bucketName);
        const fileObject = bucket.file(gcsFileName);





        // const gcsFileName = `${Date.now()}-${file.originalname}`;

        // await gstorage.bucket(bucketName).file.save(file.buffer, {
        await fileObject.save(file.buffer, {
          resumable: false,
          gzip: true,
          metadata: {
            contentType: file.mimetype,
          },
          
        });

           // Make the file public
        //    await fileObject.makePublic();

        const fileUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
        // return { originalName: file.originalname, url: fileUrl };
        return  fileUrl 




        // const gcsFileName = `${Date.now()}-${file.originalname}`;
    
        // return gstorage.bucket(bucketName).file(gcsFileName).save(file.buffer, {
        //   resumable: false,
        //   gzip: true,
        //   metadata: {
        //     contentType: file.mimetype,
        //   },
        // });
      });
    
      try {
        const uploadedFiles = await Promise.all(uploadPromises);


        req.body.images=uploadedFiles
        // uploadedFiles
        // console.log({uploadedFiles});
        // const fileUrls = uploadedFiles.map((file) => {
        // //   const fileName = file.name;
        // //   const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        //   return file;
        // });
    
        next();
        // res.status(200).json({ urls: fileUrls });
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while uploading the files.');
      }
 
};

// module.exports = uploadMiddleware;

export default uploadGcsMiddleware;
