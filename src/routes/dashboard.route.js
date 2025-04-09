import { Router } from 'express';
import {
    getChannelStats,getChannelVideos
} from "../controllers/dashboard.controller.js"

import jwtvarify from '../middlwares/auth.middleware.js';

const router = Router();

router.use(jwtvarify); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router