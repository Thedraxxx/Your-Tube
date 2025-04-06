import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware.js";
import { publishComment, editComment, } from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.route("/:videoId").post(jwtvarify,publishComment);
commentRouter.route("/edit/:commentId").patch(jwtvarify,editComment);
// commentRouter.route("/:commentId").delete(jwtvarify,deleteComment);
export default commentRouter;