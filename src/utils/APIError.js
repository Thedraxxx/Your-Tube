// Define a class 'ApiError' that extends the built-in JavaScript 'Error' class
class ApiError extends Error {

    // Constructor function that initializes the error object when an instance is created
    constructor(
        statusCode,  // HTTP status code (e.g., 400 for Bad Request, 500 for Internal Server Error)
        message = "Something went wrong",  // Default error message if not provided
        error = [],  // Additional error details (could be an array of error messages)
        stack = ""  // Stack trace for debugging (optional)
    ) {
        super(message); // Call the parent (Error) constructor with the message

        // Assign the provided status code (e.g., 404, 500)
        this.statusCode = statusCode;

        // Default data is set to null (can be used later if needed)
        this.data = null;

        // Store the error message
        this.message = message;

        // Indicates that the API call was unsuccessful
        this.success = false;

        // Stores any additional error details (e.g., validation errors)
        this.error = error;

        // If a stack trace is provided, use it
        if (stack) {
            this.stack = stack;
        } else {
            // Otherwise, capture the current stack trace to help with debugging
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

// Export the 'ApiError' class so it can be used in other files
export default ApiError;
