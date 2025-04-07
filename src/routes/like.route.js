import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware";

const likeRouter = Router();

likeRouter.route("/toggle/:videoId").post(jwtvarify,toggleVideoLike);
export default likeRouter;