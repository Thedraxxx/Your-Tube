import ApiError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import jwt, { verify } from "jsonwebtoken";
import User from "../models/user.model.js";
const jwtvarify = asyncHandler(async (req, _, next) => {
  try {
    //extract token
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(400, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid access token");
  }
});

export default jwtvarify;
