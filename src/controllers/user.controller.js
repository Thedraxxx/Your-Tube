import User from "../models/user.model.js";
import ApiError from "../utils/APIError.js";
import ApiResponse from "../utils/APIrsponse.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import uploadOnCloudinary from "../utils/cloudninary.js";

const userRegister = asyncHandler(async (req, res) => {
    // Extensive Debugging Logs

    // console.log("==== REGISTRATION DEBUG ====");
    // console.log("Full Request Body:", JSON.stringify(req.body, null, 2));
    // console.log("Request Files:", JSON.stringify(req.files, null, 2));

    const { username, email, password, fullname } = req.body;

    // Comprehensive validation with detailed logging

    // console.log("Validation Checks:");
    // console.log("username:", username);
    // console.log("email:", email);
    // console.log("password:", password ? "***MASKED***" : "MISSING");
    // console.log("fullname:", fullname);

    if (!username || !email || !password || !fullname) {
        console.error("Missing Fields Detected");
        throw new ApiError(400, "All fields are required");
    }

    // Normalize inputs
    const usernameTrimmed = username.trim().toLowerCase();
    const emailTrimmed = email.trim().toLowerCase();

    try {
        // Detailed existing user check
        // console.log("Checking for Existing User:");
        // console.log("Searching for username:", usernameTrimmed);
        // console.log("Searching for email:", emailTrimmed);

        const existingUser = await User.findOne({
            $or: [
                { username: usernameTrimmed },
                { email: emailTrimmed }
            ]
        });

        // Log existing user details

        // console.log("Existing User Check Result:");
        // console.log(existingUser ? JSON.stringify(existingUser, null, 2) : "No existing user found");

        if (existingUser) {
            const conflictField = existingUser.username === usernameTrimmed ? 'username' : 'email';
            console.warn(`Duplicate ${conflictField} Detected`);
            throw new ApiError(409, `User with this ${conflictField} already exists`);
        }

        // Handle avatar upload
        const avatarLocalPath = req.files?.avatar?.[0]?.path;
        // console.log("Avatar Local Path:", avatarLocalPath);

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        console.log("Cloudinary Avatar Upload:", avatar ? "Success" : "Failed");

        if (!avatar) {
            throw new ApiError(400, "Avatar upload failed");
        }

        // Optional cover image
        let coverImage = null;
        if (req.files?.coverImage?.[0]?.path) {
            coverImage = await uploadOnCloudinary(req.files.coverImage[0].path);
            console.log("Cloudinary Cover Image Upload:", coverImage ? "Success" : "Failed");
        }

        // Create user
        // console.log("Creating User with Details:");
        // console.log("Fullname:", fullname);
        // console.log("Avatar URL:", avatar.url);
        // console.log("Cover Image URL:", coverImage?.url || "None");
        // console.log("Email:", emailTrimmed);
        // console.log("Username:", usernameTrimmed);

        const user = await User.create({
            fullname,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email: emailTrimmed,
            password,
            username: usernameTrimmed
        });

        console.log("User Created Successfully!");

        // Fetch created user without sensitive information
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        
        return res.status(201).json(
            new ApiResponse(200, createdUser, "User registered successfully")
        );

    } catch (error) {
        // Comprehensive error logging
        // console.error("Registration Error:");
        // console.error("Error Name:", error.name);
        // console.error("Error Code:", error.code);
        // console.error("Error Message:", error.message);
        // console.error("Full Error:", error);

        // Handle specific MongoDB duplicate key error
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern)[0];
            console.warn(`Duplicate Key Error: ${duplicateField}`);
            throw new ApiError(409, `${duplicateField} already exists`);
        }
        throw error;
    }
});

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

