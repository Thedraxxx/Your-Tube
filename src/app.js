import express from "express";  // Importing Express framework
import cors from "cors";        // Importing CORS middleware to handle cross-origin requests
import cookieParser from "cookie-parser"; // Importing middleware to parse cookies

const app = express(); // Creating an Express application instance
// Middleware to handle Cross-Origin Resource Sharing (CORS)
// It allows requests from different origins specified in the environment variable `CORS_ORIGIN`
app.use(cors({
    origin: process.env.CORS_ORIGIN // Only allows requests from this origin
}));

// Middleware to parse JSON data from incoming requests
// `limit: "20kb"` restricts JSON payload size to 20 kilobytes to prevent large payload attacks
app.use(express.json({
    limit: "20kb"
}));

// Middleware to serve static files (like images, CSS, JS) from the "public" directory
app.use(express.static("public"));

// Middleware to parse URL-encoded data (e.g., form submissions)
// `extended: true` allows nested objects in query strings
// `limit: "16kb"` restricts the payload size to 16 kilobytes
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to parse cookies from incoming requests
// This makes cookies accessible through `req.cookies`
app.use(cookieParser());

//Routes
import userRouter from "./routes/user.routes.js";
// route declaration....
app.use("/api/v2/users",userRouter)

export default app; // Exporting the app instance for use in other files (e.g., server.js)
