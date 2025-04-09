// 🚀 asyncHandler: A utility function to handle errors in async route handlers

const asyncHandler = (fn) => { 
    return (req, res, next) => {  // 👈 This is the returned middleware function that Express will execute
        
        // 🛠 Ensures the function always returns a Promise
        // If `fn` is an async function, it might throw an error.
        // Wrapping `fn(req, res, next)` inside `Promise.resolve()` ensures it always returns a Promise.
        Promise.resolve(fn(req, res, next)) 

        // 🔥 If an error occurs inside `fn`, catch it and pass it to Express's built-in error handler
        // `next(error)` will send the error to the next middleware (which should handle errors)
        .catch(next);
    }
};

// 🎯 Exporting asyncHandler so it can be used in other files
export { asyncHandler };
