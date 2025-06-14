import ApiError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const jwtvarify = asyncHandler(async (req, _, next) => {
  try {
    // Extract token from cookies or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");   //Authorization: Bearer abc123token
    // console.log(token);
    // console.log("cookies : ",req.cookies)
    // console.log("auth header : ",req.header("Authorization"));
    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find user from token's decoded ID
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(400, "Invalid Access Token");
    }

    // Attach user data to request for further use
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export default jwtvarify;
