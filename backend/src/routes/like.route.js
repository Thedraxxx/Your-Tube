import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware.js";
import { toggleCommentLike, toggleVideoLike, getLikedVideos, videoLikeStatus } from "../controllers/like.controller.js";
const likeRouter = Router();

likeRouter.route("/toggle/:videoId").post(jwtvarify,toggleVideoLike);
likeRouter.route("/status/:videoId").get(jwtvarify,videoLikeStatus);
likeRouter.route("/toggle/comment/:commentId").post(jwtvarify,toggleCommentLike);
likeRouter.route("/videos").get(jwtvarify, getLikedVideos);
export default likeRouter;