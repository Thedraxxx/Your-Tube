// 🔹 What it does?

// Uploads images to Cloudinary.

// Deletes temporary files from local storage after uploading.

// Returns Cloudinary response with the uploaded image URL.

// 🔹 When is this used?

// This function is called in the controller (userRegister.js) when the user uploads an avatar.


// Import Cloudinary V2 SDK
import { v2 as cloudinary } from "cloudinary";
// Import file system module to handle local file operations
import fs from "fs";

// Configure Cloudinary with credentials from environment variables
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,        // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET   // Your Cloudinary API secret
});

/**
 * Function to upload a file to Cloudinary.
 * @param {string} localFilePath - The path of the file stored locally before upload.
 * @returns {object | null} - Returns Cloudinary response object if successful, otherwise null.
 */
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // If the file path is not provided, return null
        if (!localFilePath) return null;

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" // Automatically detects the file type (image, video, etc.)
        });

        // File uploaded successfully, now deleting it from local storage
        fs.unlinkSync(localFilePath);

        // Return Cloudinary's response, which contains the uploaded file URL and other details
        return response;

    } catch (error) {
        // If an error occurs, delete the local file (cleanup)
        fs.unlinkSync(localFilePath);

        // Return null as the upload failed
        return null;
    }
};

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

