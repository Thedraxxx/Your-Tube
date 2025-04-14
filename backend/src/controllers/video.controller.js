import { asyncHandler } from "../utils/asyncHandeler.js";
import Video from "../models/video.model.js";
import ApiResponse from "../utils/APIrsponse.js";
import ApiError from "../utils/APIError.js";
import {
  getPublicIdFromUrl,
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudninary.js";
/*
  fetch video form the database
*/
const fetchVideo = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    owner,
  } = req.query;

  const matchStage = {
    isPublished: true,
  };

  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (owner) {
    matchStage.owner = owner;
  }

  const aggrigatQuery = Video.aggregate([
    { $match: matchStage },
    {
      $sort: {
        [sortBy]: sortType === "asc" ? 1 : -1,
      },
    },
    {
      $lookup: {
        from: "users", // 👈 collection name of users
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true, // Just in case the owner is missing
      },
    },
    {
      $project: {
        title: 1,
        thumbnail: 1,
        duration: 1,
        views: 1,
        createdAt: 1,
        owner: {
          _id: 1,
          fullname: 1,
          username: 1,
        },
      },
    },
  ]);

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const result = await Video.aggregatePaginate(aggrigatQuery, options);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "videos fetched successfully."));
});
const getVideoById = asyncHandler(async (req, res) => {
  console.log(req.params);
  const { videoid } = req.params;
  console.log(videoid);
  // Check if videoid is valid
  if (!videoid) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Video ID is required."));
  }

  // Fetch video by ID and populate owner details if needed
  const video = await Video.findById(videoid).populate(
    "owner",
    "username avatar"
  );

  if (!video) {
    return res.status(404).json(new ApiResponse(404, null, "Video not found."));
  }

  // Optional: Restrict access to unpublished videos unless owner is viewing
  if (!video.isPublished) {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "This video is not published."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully."));
});

/*
   publish video 
*/
const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  console.log(req.body);
  if (!title.trim() || !description.trim()) {
    throw new ApiError(400, "this feild are required");
  }

  console.log(req.files);
  const videoLocalPath = req.files?.videos?.[0]?.path;
  const thumbnailLocalpath = req.files?.thumbnail?.[0]?.path;
  console.log("video: ", videoLocalPath);
  console.log("thumbnail: ", thumbnailLocalpath);
  if (!videoLocalPath || !thumbnailLocalpath) {
    throw new ApiError(400, "no files uploaded");
  }
  const video = await uploadOnCloudinary(videoLocalPath);
  if (!video.url) {
    ApiError(400, "video upload failed");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalpath);
  if (!thumbnail.url) {
    ApiError(400, "thumbnailupload fail");
  }
  const videoUpload = await Video.create({
    title,
    description,
    thumbnail: thumbnail.url,
    videoFile: video.url,
    duration: video.duration,
    owner: req.user._id,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, videoUpload, "video publish successfully"));
});
/*
  delete selected video
*/
const deleteVideo = asyncHandler(async (req, res) => {
  const videoid = req.params?.id.trim();
  const userId = req.user?._id;
  // console.log(videoid);
  const video = await Video.findById(videoid);
  if (!video) {
    throw new ApiError(404, "video not found.");
  }
  // console.log('user videos:',video);
  console.log('user:',video.owner);
  console.log('userid :', userId);
  if (!video.owner.equals(userId)) {
    throw new ApiError(403, "you are not authorized to delete this video.");
  }
  //   console.log(video.videoFile)
  const videoPublicId = getPublicIdFromUrl(video.videoFile);
  const thumbnailPublicId = getPublicIdFromUrl(video.thumbnail);

  await deleteFromCloudinary(videoPublicId, "video");
  await deleteFromCloudinary(thumbnailPublicId, "image");

  await video.deleteOne();
  return res.status(200).json(new ApiResponse(200, null, "video is deleted."));
});
/*
   edit video
*/
const editVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  console.log('req body :',req.body)
  console.log(req.params)
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiResponse(404, null, "Video not found"));
  }
  console.log("video owner:",video.owner)
  console.log("req user: ", req.user._id)

  if (video.owner.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Not authorized to edit this video"));
  }

  video.title = title || video.title;
  video.description = description || video.description;

  const updatedVideo = await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video details edited successfully")
    );
});
const fetchUserVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const videos = await Video.find({
    owner: userId,
  }).sort({createdAt: -1});

  if(!videos){
    throw new ApiError(404,"no vidoes found")
  }
  return res.status(200).json(
    new ApiResponse(200,videos,"fetched video scussfully")
  )
});

export { fetchVideo, uploadVideo, deleteVideo, editVideo, getVideoById , fetchUserVideos};
