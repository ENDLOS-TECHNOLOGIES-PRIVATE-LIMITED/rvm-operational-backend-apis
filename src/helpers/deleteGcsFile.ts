import { Storage } from '@google-cloud/storage';


const storage = new Storage({
    keyFilename: "mykey.json", // Path to your JSON key file
    projectId: "endlos-studio-website", // Your Google Cloud project ID
  });


  
  const bucketName = "rvmoperationadditionalbucket"; // Name of your GCS bucket



const deleteGcsFiles = async (fileNames: string[]): Promise<{ fileName: string, deleted: boolean }[]> => {
  try {
    const bucket = storage.bucket(bucketName);

    const deletionPromises = fileNames.map(async (fileName) => {
      const file = bucket.file(fileName);


      const deleteFile = await file.delete()

      .then(success=>{


       return  {fileName, deleted: true }


      })


   .catch((error)=>{

if( error.errors[0].reason =="notFound"){
                              return{
                                fileName : fileName, 
                                deleted  : false,
                                reason: error.errors[0].reason
                              }
                            }
                            else{
                              throw new Error(error)
                            }
                           

                          })

      
      
      console.log(`File ${fileName} deleted successfully.`);
      // return { fileName, deleted: true };
      return deleteFile;
    });

    const deletedFiles = await Promise.all(deletionPromises);

    return deletedFiles;
  } catch (error) {
    console.error('Error deleting files:', error);
    return [];
  }
};

export default deleteGcsFiles;



