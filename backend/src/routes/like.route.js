import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware.js";
import { toggleCommentLike, toggleVideoLike, getLikedVideos } from "../controllers/like.controller.js";
const likeRouter = Router();

likeRouter.route("/toggle/:videoId").post(jwtvarify,toggleVideoLike);
likeRouter.route("/toggle/comment/:commentId").post(jwtvarify,toggleCommentLike);
likeRouter.route("/videos").get(jwtvarify, getLikedVideos);
export default likeRouter;