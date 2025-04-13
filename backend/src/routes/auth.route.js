import { Router } from "express";
import jwtvarify from "../middlwares/auth.middleware.js";

const authRouter = Router();

authRouter.get("/check-auth", jwtvarify, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User is authenticated",
    user: req.user, // optional
  });
});

export default authRouter;
