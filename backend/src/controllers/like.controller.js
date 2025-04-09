import { asyncHandler } from "../utils/asyncHandeler.js";
import ApiError from "../utils/APIError.js";
import ApiResponse from "../utils/APIrsponse.js";
import Like from "../models/likes.model.js";
import { populate } from "dotenv";

const toggleVideoLike = asyncHandler(async(req,res)=>{
         const {videoId} = req.params;
         const userId = req.user._id; // kasla like garako...

         if(!videoId){
            throw ApiError(404,"Video not found.");
         }
        const existingLike = await Like.findOne({
            videos: videoId,
            likedby: userId,
        }); 
        if(existingLike){
              await existingLike.deleteOne();
              return res.status(200).json(new ApiResponse(200,null,"removed like successfully."));
        }else{
           const newLike = await Like.create({
                videos: videoId,
                likedby: userId,
        });
        return res.status(200).json(new ApiResponse(200,newLike,"liked successfully."));
        
        }
});
const toggleCommentLike = asyncHandler(async(req,res)=>{
       const {commentId} = req.params;
       const userId = req.user._id;
     
       if(!commentId){
            throw new ApiError(404,"comment is not provided")
       }
       const existingLike = await Like.findOne({
            comment: commentId,
            likedby: userId
        })
        if(existingLike){
            await existingLike.deleteOne();
        return res.status(200).json( new ApiResponse(200, null , " unliked the comment"))
        }
        else{
           const newLike = await Like.create({
                comment: commentId,
                likedby: userId
            });
        return res.status(200).json( new ApiResponse(201, newLike , " liked the comment"))
            
        }
});

const getLikedVideos = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const likedVideos =await Like.findOne({likedby: userId})
    .populate(
        {
            path: "videos",
            select: "title description owner",
            
            populate: {
                path: "owner",
                select: "username avatar"
            }
            
        }
    )
     return res.status(200).json(
        new ApiResponse(200,likedVideos," sccessfully fetch the liked videos")
     )  
})

export {toggleVideoLike, toggleCommentLike, getLikedVideos}