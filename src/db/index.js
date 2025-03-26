import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import User from "../models/user.model.js"; // Import the User model

// Function to connect to MongoDB
const connectDatabase = async () => {
    try {
        // Attempt to establish a connection with MongoDB
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    
        // Log successful connection
        console.log(`\n ✅ MongoDB connected successfully at: ${connectionInstance.connection.host}`);
        
        // Try to drop the problematic userName index
        try {
            await User.collection.dropIndex('userName_1');
            console.log('✅ Dropped userName index successfully');
        } catch (indexDropError) {
            // This will catch and log if the index doesn't exist or can't be dropped
            console.log('ℹ️ No userName index found or error dropping index:', indexDropError.message);
        }
        
        return connectionInstance;
    } catch (error) {
        // Log error if connection fails
        console.error("❌ Error connecting to MongoDB:", error.message);
        
        // Exit process if database connection fails
        process.exit(1);
    }
};

// Export the function for use in other files
export default connectDatabase;