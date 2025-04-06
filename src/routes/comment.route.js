import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware.js";
import { publishComment, editComment, deleteComment, getVideoComment
} from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.route("/:videoId").post(jwtvarify,publishComment);
commentRouter.route("/edit/:commentId").patch(jwtvarify,editComment);
commentRouter.route("/:commentId").delete(jwtvarify,deleteComment);
commentRouter.route("/:videoId").get(jwtvarify,getVideoComment)
export default commentRouter;