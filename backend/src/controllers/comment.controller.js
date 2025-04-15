import ApiError from "../utils/APIError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import Comment from "../models/comments.model.js";
import ApiResponse from "../utils/APIrsponse.js";
import mongoose from "mongoose";
/*
  publish Comment..
*/
const publishComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;
  const userId = req.user._id;
  //  console.log(req.body);
  //  console.log(videoId);
  //  console.log(userId);

  if (!content) {
    throw new ApiError(400, "enpty content");
  }
  const commentContant = await Comment.create({
    content,
    owner: userId,
    videos: videoId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, commentContant, "commented successfully"));
});
/*
   edit comment
*/
const editComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;
  if (!content.trim()) {
    throw new ApiError(400, "enpty content");
  }
  const editedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: { content },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, editedComment, "comment edited successfully"));
});
/*
   delete commetn...
*/
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  await comment.deleteOne();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment deleted successfully"));
});
/*
   fetch comment of a particular video
*/
const getVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  // console.log(videoId);
  const comments = await Comment.aggregate([
    { $match: { videos: new mongoose.Types.ObjectId(videoId) } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    { $skip: (page - 1) * limit },
    {
      $lookup: {
        from: "users", //arko collection bata laaunuxa
        localField: "owner", //comment collection ma tyo unique key k vayrasave ca
        foreignField: "_id", // user collection ma k vanara save xa
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $project: {
        // like kun kun chij matra display garna...
        content: 1,
        videos: 1,
        createdAt: 1,
        ownerDetails: {
          _id: 1,
          username: 1,
          fullname: 1,
          avatar: 1,
        },
      },
    },
  ]);
//   console.log(comments);
  if (!comments) {
    throw new ApiError(401, "comments not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "commeent fetche succcussfully."));
});
export { publishComment, editComment, deleteComment, getVideoComment };
