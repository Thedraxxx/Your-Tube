import { Router } from "express";
import {
  uploadVideo,
  fetchVideo,
  deleteVideo,
  getVideoById,
  fetchUserVideos,
  editVideo
} from "../controllers/video.controller.js";
import jwtvarify from "../middlwares/auth.middleware.js";
import upload from "../middlwares/multer.middleware.js";
const videoRouter = Router();
videoRouter.route("/single/:videoid").get(getVideoById);
videoRouter.route("/").get(fetchVideo);
videoRouter.route("/publish").post(
  jwtvarify,
  upload.fields([
    { name: "videos", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  uploadVideo
);

videoRouter.route("/:id").delete(jwtvarify, deleteVideo);
videoRouter.route("/userVideos").get(jwtvarify,fetchUserVideos);
videoRouter.route("/editVideo/:videoId").patch(jwtvarify,editVideo);


export default videoRouter;
