//asynchandeler is a function that take another function(fn) as an argument....
//This function is usually an async function that handles a request in Express......
const asyncHandler = (fn)=> (req,res,next) => {
    //promise.resolve runs the provided function and ensure it always return the promises.....
    //This is imp because if fn is an async function it misght throw an error....
    //this function is wrapped in promise.rosolve() to make sure that even if fn fails, it can be caught.....
    Promise.resolve(fn(req,res,next))
        
    
        // If an error occurs inside fn, the .catch(next) will catch it.
        // 'next' is a function provided by Express to handle errors.
        // Calling next(error) passes the error to Express's built-in error handler.
    .catch(next);
}


export {asyncHandler}