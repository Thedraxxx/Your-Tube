import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware.js";
import { toggleSubscriber,getUserChannelSubscribers, getUserSubscribedChannel, checkSubscriptionStatus } from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();

subscriptionRouter.route("/status/:channelId").get(jwtvarify,checkSubscriptionStatus)
subscriptionRouter.route("/subscribe/:channelId").post(jwtvarify,toggleSubscriber)
subscriptionRouter.route("/subscriber/:channelId").get(jwtvarify,getUserChannelSubscribers)
subscriptionRouter.route("/subscriber/:subscriberId").get(jwtvarify,getUserSubscribedChannel)
export default subscriptionRouter;