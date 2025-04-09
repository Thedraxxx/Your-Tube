import dotenv from "dotenv"
import connectDatabase from "./db/index.js";
import app from "./app.js";

dotenv.config({  //load the .env file to access the variable
    path: './.env'
})
connectDatabase()   //so it return promesies and the it make sure to run the server in given port..
.then(()=>{

     app.listen(process.env.PORT||8000, ()=>{
        console.log(`server is running in the port ${process.env.PORT}`)
     })
})  
.catch((Error)=>{
    console.log("Error while running server..",Error);
    process.exit(1);
});