import User from "../models/user.model.js";
import ApiError from "../utils/APIError.js";
import ApiResponse from "../utils/APIrsponse.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import uploadOnCloudinary from "../utils/cloudninary.js";

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "somehing wrong with generating accessa and refresh token"
    );
  }
};

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
    const existingUser = await User.findOne({
      $or: [{ username: usernameTrimmed }, { email: emailTrimmed }],
    });

    // Log existing user details

    // console.log("Existing User Check Result:");
    // console.log(existingUser ? JSON.stringify(existingUser, null, 2) : "No existing user found");

    if (existingUser) {
      const conflictField =
        existingUser.username === usernameTrimmed ? "username" : "email";
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
      console.log(
        "Cloudinary Cover Image Upload:",
        coverImage ? "Success" : "Failed"
      );
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
      username: usernameTrimmed,
    });

    console.log("User Created Successfully!");

    // Fetch created user without sensitive information
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    // Handle specific MongoDB duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      console.warn(`Duplicate Key Error: ${duplicateField}`);
      throw new ApiError(409, `${duplicateField} already exists`);
    }
    throw error;
  }
});
// Here's a step-by-step guide for implementing login functionality:

// 1. Controller Location
// - Create the login logic in the same `user.controller.js` file
// - Name the function something like `userLogin`

// 2. Input Validation
// - Check if email and password are provided
// - Trim and validate email format
// - Ensure password meets basic requirements

// 3. Database Query
// - Find user by email in the database
// - Use `.select("+password")` to include the password field
// - Check if user exists

// 4. Password Verification
// - Use the `isPasswordCorrect` method from your user model
// - Compare the provided password with stored hash
// - Handle incorrect password scenarios

// 5. Token Generation
// - Generate access token using `generateAccessToken()`
// - Generate refresh token using `generateRefreshToken()`
// - Consider storing refresh token in database (optional)

// 6. Response Handling
// - Create a response with user details
// - Exclude sensitive information (password, tokens)
// - Set up cookie options for tokens
// - Use `ApiResponse` utility for consistent response format

// 7. Route Setup
// - Add a new POST route in `user.routes.js`
// - Map the login controller to this route

// 8. Error Handling
// - Use `ApiError` for different error scenarios
// - Handle cases like:
//   - User not found
//   - Incorrect password
//   - Missing credentials

// 9. Security Considerations
// - Use HTTPS in production
// - Implement httpOnly cookies
// - Set appropriate token expiration

// 10. Optional Enhancements
// - Add login attempt tracking
// - Implement basic rate limiting
// - Log login attempts

// Would you like me to elaborate on any of these steps?
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const emailTrimmed = email.trim().toLowerCase();
  if (emailTrimmed === "") {
    throw new ApiError(401, "email xaina halako");
  }

  const existingUser = await User.findOne({ email: emailTrimmed });
  if (!existingUser) {
    throw new ApiError(401, `this emali ${email} is not registered`);
  }

  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    existingUser._id
  );

  const loggedInUser = User.findOne(existingUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user successfully loggedIn"
      )
    );
});

const loggedOut = asyncHandler(async(req,res)=>{
             await User.findByIdAndUpdate(
                req.user._id,
                {
                    $unset:{
                        refreshToken: 1
                    }
                },
                {
                    new:true
                }
             )
             const options ={
                httpOnly: true,
                secure: true
             }
             return res
             .status(200)
             .clearcookies("accessToken",options)
             .clearcookies("refreshToken",options)
             .json(
                new ApiResponse(200,{},"user logged out")
             )
})

export { userRegister, userLogin };

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
