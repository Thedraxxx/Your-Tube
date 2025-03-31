import User from "../models/user.model.js";
import ApiError from "../utils/APIError.js";
import ApiResponse from "../utils/APIrsponse.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import uploadOnCloudinary from "../utils/cloudninary.js";
import jwt from "jsonwebtoken";
/*
      Generate access and refresh token using methods from User.
*/
const generateAccessandRefreshToken = async (userId) => {
  const user = await User.findOne(userId);

  const accessToken = user.generateAccessToken();

  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
/*
    User Registration 
*/
const userRegister = asyncHandler(async (req, res) => {
  const { username, email, password, fullname } = req.body;

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

    if (existingUser) {
      const conflictField =
        existingUser.username === usernameTrimmed ? "username" : "email";
      console.warn(`Duplicate ${conflictField} Detected`);
      throw new ApiError(409, `User with this ${conflictField} already exists`);
    }

    // Handle avatar upload
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

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
/*
   User Login ...
*/
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(401, "email xaina halako");
  }

  const existingUser = await User.findOne({ email }).select("+password");
  if (!existingUser) {
    throw new ApiError(401, `this emali ${email} is not registered`);
  }

  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "incorrect password");
  }
  // console.log(existingUser._id);
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    existingUser._id
  );

  const loggedInUser = await User.findOne(existingUser._id).select(
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
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successully"
      )
    );
});
/*
   User Logged Out
*/
const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"));
});
/*
   Refreshing Access Token
*/
const refreshingAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incommingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  const decodedToken = jwt.verify(
    incommingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken?._id);
  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }
  if (incommingRefreshToken !== user?.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const { accessToken, newrefreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newrefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newrefreshToken },
        "Access token refreshed"
      )
    );
});
/*
   Change current password
*/
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // console.log(req.body)
  // console.log("old password: ", oldPassword)
  const user = await User.findById(req.user?._id).select("+password"); // password add garnu parxa
  // console.log(req.user?._id);
  // console.log(user);
  const isPasswordvalid = await user.isPasswordCorrect(oldPassword);
  //  console.log(isPasswordvalid);
  if (!isPasswordvalid) {
    throw new ApiError(401, "Invalid password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});
/*
   get current User
*/
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Fetched current user")); // this uer come form the jwtverify middleare ...
});
/*
  update accout details like email fullname
*/


export {
  userRegister,
  userLogin,
  userLogout,
  refreshingAccessToken,
  changeCurrentPassword,
  getCurrentUser,
 
};
