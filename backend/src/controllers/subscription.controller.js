import ApiError from "../utils/APIError.js";
import ApiResponse from "../utils/APIrsponse.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import Subscription from "../models/subscribtion.model.js";
import User from "../models/user.model.js";
const toggleSubscriber = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { channelId } = req.params;

  if (channelId.toString() === userId.toString()) {
    throw new ApiError(401, "Can't subscribe to your own channel.");
  }

  const databaseChannel = await User.findOne({ _id: channelId }).select("_id");

  if (!databaseChannel || databaseChannel._id.toString() !== channelId) {
    throw new ApiError(404, "Channel does not exist");
  }

  const existingSubscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  if (existingSubscription) {
    await existingSubscription.deleteOne();
    console.log("usnsubscribe")
    return res.status(200).json(
      new ApiResponse(200, { isSubscribed: false }, "Unsubscribed successfully")
    );
  } else {
    await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
     console.log("subscribe")
    return res.status(200).json(
      new ApiResponse(201, { isSubscribed: true }, "Subscribed successfully")
    );
  }
});
const checkSubscriptionStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { channelId } = req.params;

  if (userId.toString() === channelId.toString()) {
    return res
      .status(200)
      .json(new ApiResponse(200, { isSubscribed: false }, "Cannot subscribe to your own channel."));
  }

  const subscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });

  const isSubscribed = !!subscription;

  return res
    .status(200)
    .json(new ApiResponse(200, { isSubscribed }, "Subscription status fetched successfully"));
});

const getUserChannelSubscribers = asyncHandler(async(req,res)=>{
    

        const {channelId} = req.params;

        const channel =  await User.findById(channelId);

        if(!channel){
            throw new ApiError(404,"channel doesnot exist!");
        };
        const subscribers =await Subscription.find({channel: channelId})
        .populate("subscriber","username avatar")
        .exec();

        if(subscribers.length === 0 ){
            return res.status(200).json(new ApiResponse(200,[],"no subscriber found"));
        }
        return res.status(200).json(new ApiResponse(200,subscribers,"subscriber found"));

});

const getUserSubscribedChannel = asyncHandler(async(req,res)=>{
    const {subscriberId} = req.params;

   const subscriber =await Subscription.find({subscriber: subscriberId})
      .populate("chnnel","username avatar")
      .exec();

      if(subscriber.length === 0){
        return res.status(200).json(new ApiResponse(200, [], "No channels found for this subscriber"));
      }
      return res.status(200).json(new ApiResponse(200, subscriber, "Subscribed channel fetched"));
});
export { toggleSubscriber, getUserChannelSubscribers,getUserSubscribedChannel, checkSubscriptionStatus };
