import { asyncHandler } from "../utils/asyncHandeler.js";
import { Video } from "../models/video.model.js";
import ApiResponse from "../utils/APIrsponse.js";
import ApiError from "../utils/APIError.js";
import { getPublicIdFromUrl, deleteFromCloudinary,uploadOnCloudinary } from "../utils/cloudninary.js";

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
  console.log(matchStage)
  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }
  console.log(query)
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
  ]);
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const result = await Video.aggregatePaginate(aggrigatQuery, options);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "videos fetchd successfully."));
});
const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
console.log(req.body)
  if (!title.trim() || !description.trim()) {
    throw new ApiError(400, "this feild are required");
  }
  
  console.log(req.files)
  const videoLocalPath = req.files?.videos?.[0]?.path;
  const thumbnailLocalpath = req.files?.thumbnail?.[0]?.path;
 console.log("video: ",videoLocalPath)
 console.log("thumbnail: ",thumbnailLocalpath)
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

const deleteVideo = asyncHandler(async (req, res) => {
  const videoId = req.params?.id.trim();
  const userId = req.user?._id;
// console.log(videoId);
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "video not found.");
  }
// console.log(video)
// console.log(video.owner)
  if (video.owner.toString() !== userId.toString()) {
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

export { fetchVideo, uploadVideo, deleteVideo };
