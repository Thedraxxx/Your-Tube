import { asyncHandler } from "../utils/asyncHandeler.js";
import ApiError from "../utils/APIError.js";
import ApiResponse from "../utils/APIrsponse.js";
import Like from "../models/likes.model.js";

const toggleVideoLike = asyncHandler(async(req,res)=>{
         const {videoId} = req.params;
         const userId = req.user._id; // kasla like garako...

         if(!videoId){
            throw ApiError(404,"Video not found.");
         }
        const existingLike = await Like.findById({
            videos: videoId,
            likedBy: userId,
        }); 
        if(existingLike){
              await Like.deleteOne();
              return res.status(200).json(new ApiResponse(200,null,"removed like successfully."));
        }else{
           const newLike = await Like.create({
                videos: videoId,
                likeBy: userId,
        });
        return res.status(200).json(new ApiResponse(200,newLike,"liked successfully."));
        
        }
         


})

export {toggleVideoLike}