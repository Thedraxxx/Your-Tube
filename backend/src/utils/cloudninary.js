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

    // Check if file exists before attempting upload
    if (!fs.existsSync(localFilePath)) {
      console.log("File does not exist at path:", localFilePath);
      return null;
    }

    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    
    // File has been uploaded successfully
    console.log("File is uploaded on cloudinary:", response.url);
    
    // Safely delete the local file
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (deleteError) {
      console.error("Error deleting local file:", deleteError);
      // Continue execution despite file deletion error
    }
    
    return response;
    
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    
    // Safely delete the local file if it exists
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (deleteError) {
      console.error("Error deleting local file after failed upload:", deleteError);
    }
    
    return null;
  }
}

const deleteFromCloudinary = async (publicId, resource_type) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resource_type
    });
    return result;
  } catch (error) {
    console.error("Cloudinary deletion failed:", error);
    return null;
  }
};

const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const fileWithExt = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  
  const publicId = `${folder}/${fileWithExt.split(".")[0]}`;
  return publicId;
};

// Export the configured Cloudinary instance
export {uploadOnCloudinary, deleteFromCloudinary, getPublicIdFromUrl}




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

