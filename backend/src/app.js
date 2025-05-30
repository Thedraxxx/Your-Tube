import express from "express";                  // Express framework
import cors from "cors";                        // Handles Cross-Origin Resource Sharing
import cookieParser from "cookie-parser";       // Parses cookies from requests

const app = express();                          // Create an Express application

const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
    "http://localhost:3000"
  ];
  
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));
  
  
// Body Parsers
app.use(express.json({ limit: "20kb" }));       // Parse JSON requests (limit: 20kb)
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parse URL-encoded data

// Static File Serving
app.use(express.static("public"));              // Serve static files from "public" folder

// Cookie Parser
app.use(cookieParser());                        // Parse cookies and attach to req.cookies

// Routes
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/videos.route.js";
import commentRouter from "./routes/comment.route.js";
import likeRouter from "./routes/like.route.js";
import subscriptionRouter from "./routes/subsciption.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import authRouter from "./routes/auth.route.js";
app.use("/api/v2/users", userRouter);           // Mount user-related routes
app.use("/api/v2/videos",videoRouter);
app.use("/api/v2/comments",commentRouter);
app.use("/api/v2/likes",likeRouter);
app.use("/api/v2/subscribers",subscriptionRouter);
app.use("/api/v2/dashboard",dashboardRouter);
app.use("/api/v2/auths",authRouter);

export default app;                             // Export app instance for use in server.js
