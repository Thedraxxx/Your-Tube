import { Router } from "express";
import { userRegister } from "../controllers/user.controller.js";
import upload from "../middlwares/multer.middleware.js";
import jwtvarify from "../middlwares/auth.middleware.js";


import {
  userLogin,
  userLogout,
  refreshingAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(
  // middleware befor the user register for file handling
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegister
);
userRouter.route("/login").post(upload.none(), userLogin);
userRouter.route("/logout").post(jwtvarify, userLogout);
userRouter.route("/refres-token").post(refreshingAccessToken);
userRouter.route("/change-Password").post(upload.none(),jwtvarify,changeCurrentPassword);
userRouter.route("/change-details").patch(upload.none(),jwtvarify,updateAccountDetails);
userRouter.route("/change-avatar").patch(upload.single("avatar"),jwtvarify,updateAvatar);
userRouter.route("/change-coverImage").patch(upload.single("coverImage"),jwtvarify,updateCoverImage);
userRouter.route("/current-user").get(upload.none(),jwtvarify,getCurrentUser);
userRouter.route("/c/:username").get(upload.none(),jwtvarify,getUserChannelProfile);
userRouter.route("/watch-history").get(upload.none(),jwtvarify,getWatchHistory);
export default userRouter;
