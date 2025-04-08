import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware.js";
import { toggleSubscriber } from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.route("/subscribe/:channelId").post(jwtvarify,toggleSubscriber)

export default subscriptionRouter;