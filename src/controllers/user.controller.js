import { asyncHandler } from "../utils/asyncHandeler.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../controllers/user.controller.js"
import ApiError from "../utils/APIError.js";
import ApiResponse from "../utils/APIrsponse.js";
const userRegister = asyncHandler(async(req,res)=>{
   const {username, email, password, fullname} = req.body;
   console.log(req.body)
      console.log(req.body);
     if(
      // .some kunaipani aauta array ko aauta la condition meet vo vana
      [username,email,fullname,password].some((feild)=>{
         feild?.trim()===""
      })
     ){
       throw new ApiError(400,"All feild are required");
     }
   const existingUser = await User.findOne({$or:[
      {email},
      {username}
   ]})
   console.log(existingUser);
   if(existingUser){
           throw new ApiError(409,"User with eamil and password alredy existed")
   }
   console.log(req.files)
   const avatarLocalPath =  req.files?.avatar[0]?.path;
   const coverImageLocalpath =req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
      throw new ApiError(400,"Avatar file is required")
   }
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalpath);
      
   if(!avatar){
      throw new ApiError(400,"avatar file is required.");
   }
    User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()

    })
   res.status(200).json({
      success: true,
      message: "User Register sucessfully",
      user: {
         id: newUser._id,
         username: newUser.username,
         email: newUser.email,
         avatar: newUser.avatar,
      }
   })
    const createduser = await User.findById(user._id).select("-password -refreshToken")
  if(!createduser){
   throw new ApiError(500,"something went wrong while registering the user");
  }
  return res.status(201).json(
   new ApiResponse(200, createduser, "User registered sucessfully")
  )
})

export default userRegister;



// 🚀 **User Registration Flow**
// This function handles user registration with validation, duplicate checks, avatar uploads, and database entry creation.

// 1️⃣ **Extract User Details**: 
// Retrieve user details like username, email, password, and avatar from `req.body`.
// 🧠 **Tip**: Always ensure the frontend sends correct and complete data for registration.


// 2️⃣ **Input Validation**:
// Check if all required fields (username, email, password, fullname) are provided and non-empty.
// 🔑 **Tip**: Validate inputs before processing. Use libraries like `Joi` or `express-validator` for more advanced validation.

// Example:
// `if([username, email, password, fullname].some(field => field?.trim() === ""))`


//3️⃣ **Check for Duplicates**: 
// Check if the username or email already exists in the database. Throw a conflict error (`409`) if they exist.
// 🛑 **Tip**: Avoid duplication to maintain clean data and prevent errors in future requests.


// 4️⃣ **Handle Avatar Upload**: 
// If the user provides an avatar, upload it to Cloudinary and store the URL in the database.
// 💡 **Tip**: Always upload avatars or images to a cloud storage (like Cloudinary) instead of saving locally to save storage space.
//   Handle image upload errors gracefully and inform the user if it fails.


// 5️⃣ **Create User in Database**: 
// Save the user data in the database, ensuring that sensitive data like passwords are hashed before storage.
// 🧩 **Tip**: Use tools like `bcryptjs` for hashing passwords. Always store data securely!


// 6️⃣ **Filter Sensitive Data**: 
// Remove sensitive information (passwords, refresh tokens) before sending the response back to the user.
// 🛡️ **Tip**: **Never** return sensitive data in API responses to protect user privacy. Only return safe data (username, avatar URL, etc.).


// 7️⃣ **Return Success Response**: 
// After creating the user, send a success message with the user's non-sensitive information, such as their username and avatar URL.
// 💡 **Tip**: Always return clear, friendly, and useful responses to frontend developers so they know exactly what data to expect.


// ⚡ **Additional Future-Proof Tips**:
// - **Error Handling**: Use `try-catch` blocks and custom error handling middleware to keep your code clean. It helps to standardize error responses across your app.
// - **Scalability**: As your app grows, consider implementing rate-limiting and input sanitization to prevent abuse and security issues.
// - **Password Recovery**: Plan for password recovery flows in the future using email verification or security questions.
// - **JWT**: Implement JSON Web Tokens (JWT) or other token-based authentication to manage user sessions securely.

