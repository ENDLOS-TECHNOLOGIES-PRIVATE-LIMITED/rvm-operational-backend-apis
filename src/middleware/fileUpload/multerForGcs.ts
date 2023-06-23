const { Storage } = require('@google-cloud/storage');
import config from "../../config";

const gstorage = new Storage({
    // keyFilename: "path/to/keyfile.json", // Path to your JSON key file
    keyFilename: "mykey.json", // Path to your JSON key file
    projectId: config.googleProjectId, // Your Google Cloud project ID
  });


  // const bucketName = "rvmoperationadditionalbucket"; // Name of your GCS bucket
  const bucketName = config.gcsBucketName; // Name of your GCS bucket



const uploadGcsMiddleware =async (req, res, next) => {

if (!req.files || req.files.length === 0) {
       console.log("no files ");
        
        next()

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

        // const fileUrl = `https://storage.googleapis.com/${bucketName}/${gcsFileName}`;
        const fileUrl = `${gcsFileName}`;
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
          next();
        
      } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while uploading the files.');
      }
 
};

export default uploadGcsMiddleware;
