import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware.js";
import { toggleSubscriber,getUserChannelSubscribers } from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.route("/subscribe/:channelId").post(jwtvarify,toggleSubscriber)
subscriptionRouter.route("/subscriber/:channelId").get(jwtvarify,getUserChannelSubscribers)
export default subscriptionRouter;