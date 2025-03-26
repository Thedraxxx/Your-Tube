import express from "express"; 
import cors from "cors"; 
import cookieParser from "cookie-parser"; 

const app = express(); 

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, 
  })
);

app.use(
  express.json({
    limit: "20kb",
  })
);

app.use(express.static("public")); 

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

import userRouter from "./routes/user.routes.js"; 

app.use("/api/v2/users", userRouter);

export default app; 


// 🛠️ Importing necessary modules:
// `express`: A web framework to create a server and handle routing.
// `cors`: Middleware to handle Cross-Origin Resource Sharing (CORS) and allow or restrict access to your API from other origins.
// `cookie-parser`: Middleware to parse cookies from incoming requests.


// 🚀 Initialize the Express application:
// `app`: This is the instance of your Express app where you define routes, middleware, and other configurations.


// 🔐 Set up CORS (Cross-Origin Resource Sharing) Middleware:
// This middleware is responsible for handling requests from different origins (domains). 
// Only the origin defined in your environment variable `CORS_ORIGIN` will be allowed to interact with your API. 
// This is important for security to avoid unauthorized access to your resources.


// 🔄 Setup Middleware for JSON Parsing:
// `express.json()` is used to parse JSON payloads from incoming requests. 
// The `limit: "20kb"` option restricts the size of the incoming JSON body to 20 kilobytes to prevent large payload attacks.


  
// 🖼️ Serve Static Files:
// The `express.static("public")` middleware serves static assets like images, styles, and JavaScript files from the `public` folder. 
// This is essential if you need to serve frontend assets directly from the server.


  
// 📝 Handle URL-Encoded Data:
// This middleware parses URL-encoded data, typically sent by form submissions. 
// `extended: true` allows for parsing of complex objects (nested data) in the query string, while `limit: "16kb"` limits the data size.


  
// 🍪 Cookie Parsing Middleware:
// `cookieParser()` is used to parse cookies from the incoming requests and make them available via `req.cookies`.
// This is useful for tracking sessions or handling authentication via cookies.


  
// 🧑‍💻 Import User Routes:
// The `userRouter` is imported from `user.routes.js`, where all routes related to user actions (e.g., registration, login, etc.) are defined.


  
// 🛣️ Define Route for User API:
// The `app.use("/api/v2/users", userRouter)` line connects the route path `/api/v2/users` to the user routes.
// This means that any request that starts with `/api/v2/users` will be handled by the `userRouter`.


  
// 📤 Export the Express App:
// The `app` instance is exported so it can be used in another file (e.g., `server.js`) to start the server and handle incoming requests.
