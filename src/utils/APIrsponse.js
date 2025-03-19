// Define a class called 'ApiResponse'
class ApiResponse {
  
    // Constructor function is used to initialize the object when an instance is created.
    constructor(statusCode, data, message = "Success") {

        // 'statusCode' is the HTTP status code for the response (e.g., 200 for success, 404 for not found).
        this.statusCode = statusCode;
        
        // 'data' is the actual content or information being sent back in the response (e.g., user data, results, etc.).
        this.data = data;

        // 'message' is an optional string describing the outcome of the request. Defaults to "Success".
        this.message = message;

        // 'Success' is a boolean indicating whether the request was successful or not.
        // If the statusCode is less than 400 (i.e., a successful response), Success is set to true.
        // If the statusCode is 400 or above (i.e., an error occurred), Success is set to false.
        this.success = statusCode < 400;
    }
}
