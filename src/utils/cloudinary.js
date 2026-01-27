import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async(localFilePath) =>{
    try{
        if(!localFilePath){
            console.log("file path is required ");
            return null;
        }

        const upload = cloudinary.v2.uploader.upload(localFilePath, {
            resource_type : 'auto',
            overwrite : true,
        })

        .then((result) =>{
            console.log("file uploaded on cloudinary", result);
        })
        
        console.log("uploading file on cloudinary");
        console.log(upload.url);
        return upload;
    }

    catch(error){
        console.log("error while uploading file on cloudinary", error);
    }
}


export default uploadOnCloudinary;