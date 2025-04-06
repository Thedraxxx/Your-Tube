import ApiError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import Comment from "../models/comments.model.js";
import ApiResponse from "../utils/APIrsponse.js";

const publishComment = asyncHandler(async(req,res)=>{
         const { content } =  req.body;
         const { videoId } = req.params;
         const userId = req.user._id;
         console.log(req.body);
         console.log(videoId);
         console.log(userId);

        if(!content){
            throw new ApiError(400,"enpty content");
        }
      const commentContant = await  Comment.create({
            content,
            owner: userId,
            video: videoId,
        });
        return res.status(200).json(
            new ApiResponse(200,commentContant,"commented successfully")
        )
});

export {publishComment}