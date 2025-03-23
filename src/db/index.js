import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Function to connect to MongoDB
const connectDatabase = async () => {
    try {
        // Attempt to establish a connection with MongoDB
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    

        // Log successful connection
        console.log(`\n ✅ MongoDB connected successfully at: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        // Log error if connection fails
        console.error("❌ Error connecting to MongoDB:", error.message);
        
        // Exit process if database connection fails
        process.exit(1);
    }
};

// Export the function for use in other files
export default connectDatabase;
