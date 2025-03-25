// 🔹 What it does?

// Uploads images to Cloudinary.

// Deletes temporary files from local storage after uploading.

// Returns Cloudinary response with the uploaded image URL.

// 🔹 When is this used?

// This function is called in the controller (userRegister.js) when the user uploads an avatar.


import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}
// Export the configured Cloudinary instance
export default uploadOnCloudinary;




// 🚀 Cloudinary Upload Function
// This function is designed to upload a local file to Cloudinary and handle the file efficiently.
// Here's how it works:
// 1️⃣ **Check for File Path**: It first checks if a file path is provided. If no path is found, the function returns `null`.
// 2️⃣ **Upload to Cloudinary**: If the file exists, it uploads the file to Cloudinary, and Cloudinary automatically detects the file type (whether it's an image, video, etc.)
// 3️⃣ **Cleanup**: After a successful upload, it deletes the file from local storage to keep things neat and save space. 
//    If the upload fails, it also deletes the file to prevent leaving temporary files behind.
// 4️⃣ **Return Data**: After the upload, the function returns Cloudinary's response, including the file URL and metadata so you can use it in your app. 
//    If the upload fails, it returns `null` to indicate an error, allowing you to handle the issue gracefully.

// 💡 **Why use this?**
// ✅ Files are automatically detected for their type, no need to specify.
// ✅ It saves local storage space by deleting the file after upload.
// ✅ Handles errors cleanly by ensuring no leftover files and returning useful information for failure cases.

// Always use this function for smooth, automatic file uploads to Cloudinary and keep your app's file handling clean and efficient.

