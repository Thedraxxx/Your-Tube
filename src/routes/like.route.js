import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware";
import { toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";
const likeRouter = Router();

likeRouter.route("/toggle/:videoId").post(jwtvarify,toggleVideoLike);
likeRouter.route("/toggle/:commentId").post(jwtvarify,toggleCommentLike);
export default likeRouter;