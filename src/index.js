import dotenv from "dotenv"
import connectDatabase from "./db/index.js";

dotenv.config({
    path: './env'
})
connectDatabase();