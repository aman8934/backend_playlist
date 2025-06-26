import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

 
cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:  process.env.CLOUDINARY_API_KEY,
        api_secret:  process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const uploadonCloudinary = async (localpath)  => {
    try {
        if(!localpath) return null
        // upload the file on cloudianry
       const response =await cloudinary.cloudinary.uploader.upload(localpath, {
            resource_type : "auto"
        })
        console.log('uploaded succesfully',response.url);
        return response;
    } catch (error) {

        fs.unlinkSync(localpath)
        console.log('');
        
    }
}

export {uploadonCloudinary}