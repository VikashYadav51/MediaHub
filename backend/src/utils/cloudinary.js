import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


import fs from 'fs';

const uploadOnCloudinary = async(localFilePath) =>{
    try{
        if(!localFilePath){
            console.log("file path is required ");
            return null;
        }

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type : 'auto',
            overwrite : true,
        });

        // console.log("file uploaded on cloudinary", result);
        
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return result;
    }
 
    catch(error){
        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.log("error while uploading file on cloudinary", error);
        return null;
    }
}


export default uploadOnCloudinary;
