const { Storage } = require('@google-cloud/storage');
import config from "../../config";
import utility from '../../utility';
import enums from '../../json/enum.json'
import messages from '../../json/message.json'
  
const gstorage = new Storage({
    keyFilename: "mykey.json", // Path to your JSON key file
    projectId: config.googleProjectId, // Your Google Cloud project ID
  });

const bucketName = config.gcsBucketName; // Name of your GCS bucket



const gcsFileUploader =async (req, res, next) => {

if (!req.files || req.files.length === 0) {
       console.log("no files ");
        
        next()

        return;
      }


      
    
//       const uploadPromises = req.files.map(async (file) => {

//         const gcsFileName = `${Date.now()}-${file.originalname}`;

//         const bucket = gstorage.bucket(bucketName);
//         const fileObject = bucket.file(gcsFileName);



//         await fileObject.save(file.buffer, {
//           resumable: false,
//           gzip: true,
//           metadata: {
//             contentType: file.mimetype,
//           },
          
//         });

                     
//         const fileUrl = `${gcsFileName}`;
//        return  fileUrl 

// });








// const uploadPromises = [];

// // for (let i = 0; i < req.files.length; i++) {
// for (let i = 0; i < Object.keys(req.files).length; i++) {
//   const file = req.files[`solution[${i}][image]`];
//   const gcsFileName = `${Date.now()}-${file[0].originalname}`;

//   console.log({lll:gcsFileName});

//   const bucket = gstorage.bucket(bucketName);
//   const fileObject = bucket.file(gcsFileName);

//   const uploadPromise = fileObject.save(file[0].buffer, {
//     resumable: false,
//     gzip: true,
//     metadata: {
//       contentType: file.mimetype,
//     },
//   })
//     .then(() => {

//       console.log({gcsFileName});
//       const fileUrl = `${gcsFileName}`;
//       return fileUrl;
//     });

//   uploadPromises.push(uploadPromise);
// }



// const uploadPromises = [];

// // for (let i = 0; i < req.files.length; i++) {
// for (let i = 0; i < Object.keys(req.files).length; i++) {
//   const file = req.files[`solution[${i}][image]`];
//   const gcsFileName = `${Date.now()}-${file[0].originalname}`;

//   console.log({ lll: gcsFileName });

//   const bucket = gstorage.bucket(bucketName);
//   const fileObject = bucket.file(gcsFileName);

//   const uploadPromise = new Promise((resolve, reject) => {
//     fileObject.save(file[0].buffer, {
//       resumable: false,
//       gzip: true,
//       metadata: {
//         contentType: file.mimetype,
//       },
//     }, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         console.log({ gcsFileName });
//         const fileUrl = `${gcsFileName}`;
//         resolve(fileUrl);
//       }
//     });
//   });

//   uploadPromises.push(uploadPromise);
// }

// // You can use Promise.all() to wait for all the promises to resolve
// // const results = await Promise.all(uploadPromises);




async function uploadFilesToGoogle() {
  const uploadPromises = [];
  const fileUrls = {};

  for (let i = 0; i < Object.keys(req.files).length; i++) {
    const file = req.files[`solution[${i}][image]`];
    const gcsFileName = `${Date.now()}-${file[0].originalname}`;

    const bucket = gstorage.bucket(bucketName);
    const fileObject = bucket.file(gcsFileName);

    const uploadPromise = new Promise((resolve, reject) => {
      fileObject.save(file[0].buffer, {
        resumable: false,
        gzip: true,
        metadata: {
          contentType: file.mimetype,
        },
      }, (err) => {
        if (err) {
          reject(err);
        } else {

          fileUrls[`solution[${i}][image]`] = gcsFileName;
          resolve(gcsFileName);
          
      

          // resolve(fileUrls[`solution[${i}][image]`])


          // resolve({solution[${i}][image]:gcsFileName});
        }
      });
    });

    // uploadPromises[`solution[${i}][image]`]=uploadPromise;
    // uploadPromises.push({solution[${i}][image]uploadPromise});

    uploadPromises.push(uploadPromise);
  }

  const fileNames = await Promise.all(uploadPromises);
  return fileUrls;
  // return fileNames;
}



    
      try {

        const uploadedFileNames = await uploadFilesToGoogle();
      
        req.body.solution.map((element,index)=>{

element.image = uploadedFileNames[`solution[${index}][image]`];
})

      next();
        
      } catch (error) {


        const responseCatchError = {
          req: req,
          result: -1,
          message: messages.GOOGLE_BUCKET_FILE_UPLOAD_ERROR,
          payload: {},
          logPayload: false,
        };
        
        
    return    res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
          .json(utility.createResponseObject(responseCatchError));
       
      }
 
};

export default gcsFileUploader;
