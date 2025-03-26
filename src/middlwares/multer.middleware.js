// Import the Multer library, which is used for handling file uploads in Node.js applications


// Configure storage settings for uploaded files using diskStorage (storing files locally)    


// Why store locally?
// Temporary storage before uploading to cloud (e.g., Cloudinary).
// Faster processing as files are saved on the server before further handling.
// Useful for debugging before uploading files to external storage.

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
  })
  
 const upload = multer({ 
    storage, 
    limits: {fileSize: 5 * 1024 * 1024}
})

// Export the upload instance so it can be used in other files where file uploads are needed
export default upload;


// 🚀 **Multer File Upload Function**
// This function is designed to handle file uploads on your local server using Multer.
// It efficiently manages storage and file naming. Here's how it works:

// 1️⃣ **Destination Setup**: 
// First, we define where to temporarily store the uploaded files. The function checks and places the files in the `./public/temp` folder. This is where they stay until they are further processed. 📂

// 2️⃣ **Filename Setup**:
// Then, the function saves the file with its original name (as it was uploaded). No changes are made to the file name, so it stays the same as what the user uploaded. 📝

// 3️⃣ **Multer Configuration**:
// The storage configuration is passed to Multer, allowing it to use these settings for file handling. This means any file uploaded will be managed according to the above rules. 🛠️

// 4️⃣ **Use of Multer for File Upload**:
// Multer takes care of the file upload process, including checking the file and storing it according to the setup. The `upload` object is used to handle incoming files, based on the storage configuration you provided. 🎯

/**
 * 💡 **Why use this?**
 * ✅ **Customizable File Storage**: You can decide where and how to store files locally (in this case, the `./public/temp` folder).
 * ✅ **Original Filenames**: Keeps the uploaded files’ original names, so you can easily identify them.
 * ✅ **Efficient Handling**: Multer automatically handles the file upload process without much setup from your side.
 * ✅ **Simple Setup**: By using this function, file uploads are automatically managed based on the given configurations (no additional steps needed!).

 * 🧑‍💻 **Tip**: This function is great when you're storing files locally before processing or uploading them to an external service like Cloudinary. It keeps your server clean and organized! 🎉
 */


