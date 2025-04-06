import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware.js";
import { publishComment } from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.route("/:videoId").post(jwtvarify,publishComment);
export default commentRouter;