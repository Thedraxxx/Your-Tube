import { Router } from 'express';
import {
    getChannelStats,getChannelVideos
} from "../controllers/dashboard.controller.js"

import jwtvarify from '../middlwares/auth.middleware.js';

const dashboardRouter = Router();


dashboardRouter.route("/stats/:channelId").get(jwtvarify,getChannelStats);
dashboardRouter.route("/videos/:channeId").get(jwtvarify,getChannelVideos);

export default dashboardRouter