import express from "express";                  // Express framework
import cors from "cors";                        // Handles Cross-Origin Resource Sharing
import cookieParser from "cookie-parser";       // Parses cookies from requests

const app = express();                          // Create an Express application

// CORS Middleware – allows requests from specific origin
app.use(cors({
    origin: process.env.CORS_ORIGIN,           // Set allowed origin from environment variable
    credentials: true                          // Allow cookies to be sent from frontend
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
app.use("/api/v2/users", userRouter);           // Mount user-related routes
app.use("/api/v2/videos",videoRouter);
app.use("/api/v2/comments",commentRouter);
app.use("/api/v2/likes",likeRouter);
app.use("/api/v2/subscribers",subscriptionRouter);

export default app;                             // Export app instance for use in server.js
