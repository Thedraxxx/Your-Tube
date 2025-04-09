
import mongoose from "mongoose"
import  Video  from "../models/video.model.js";
import Like from "../models/likes.model.js";
import Subscription from "../models/subscribtion.model.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import ApiResponse from "../utils/APIrsponse.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
  
    // Total Videos
    const totalVideos = await Video.countDocuments({ owner: channelId });
  
    
    const totalViewsAgg = await Video.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
      { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalViews = totalViewsAgg[0]?.totalViews || 0;
  
    // Total Likes on videos
    const totalLikes = await Like.countDocuments({ videos: { $exists: true }, likedby: { $exists: true } });
  
    // Total Subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
  
    res.status(200).json(
      new ApiResponse(200, {
        totalVideos,
        totalViews,
        totalSubscribers,
        totalLikes // This is total likes count (not just for the channel unless Like schema tracks video owner too)
      }, "Channel stats fetched successfully")
    );
  });
  
  const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
  
    const videos = await Video.find({ owner: channelId })
      .select("title description thumbnail url views createdAt")
      .sort({ createdAt: -1 });
  
    res.status(200).json(
      new ApiResponse(200, videos, "Channel videos fetched successfully")
    );
  });
  

export {getChannelStats, getChannelVideos}