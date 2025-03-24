import { asyncHandler } from "../utils/asyncHandeler.js";
import userSchema from "../models/user.model.js";
import cloudinary from "../utils/cloudninary.js";
const userRegister = asyncHandler(async(req,res)=>{
   // get user creditals form the frontedn ....
   // cehck for the validation of the feilds ...
   // check if the user alredy exist ...
   // check for images, cheks for avatar ...
   // upload them to cloudinary file and image or avatar if included...
   // crate a user obj - create entry in database ...
   // remove password and refrash token fiedld form response...
   // check for user creation 
   // return response...

   const {username, email, password, fullName, avatar} = req.body;

   if(!username || !email || !password){
      return res.status(400).json({message: "All feilds are required."});
   };
   const existingEmail = await userSchema.findOne({email});

   if(existingEmail){
      return res.status(400).json({message: "Email is alredy exist"})
   }
      // Handle avatar image upload if an avatar is provided
      let avatarUrl = avatar;
      if (req.file) {  // Assuming avatar image is uploaded via 'req.file'
         const uploadResponse = await cloudinary(req.file.path); // Upload to Cloudinary
         if (uploadResponse) {
            avatarUrl = uploadResponse.secure_url; // Get the Cloudinary URL of the uploaded image
         } else {
            return res.status(500).json({ message: "Failed to upload avatar image." });
         }
      }
   const newUser = await userSchema.create({
      userName,
      email,
      fullName,
      password,
      avatar: avatarUrl,
   });
   res.status(200).json({
      success: true,
      message: "User Register sucessfully",
      user: {
         id: newUser._id,
         userName: newUser.userName,
         email: newUser.email,
         avatar: newUser.avatar,
      }
   })


})

export default userRegister;