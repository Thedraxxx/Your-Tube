import ApiError from "../utils/APIError.js";
import ApiResponse from "../utils/APIrsponse.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import Subscription from "../models/subscribtion.model.js";
import User from "../models/user.model.js";
const toggleSubscriber = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // console.log(userId);
  const { channelId } = req.params;

  console.log(channelId);
  if (channelId.toString() === userId.toString()) {
    throw new ApiError(401, "cant subsribe to your own channel.");
  }
  const databaseChanenlId = await User.findOne({
    _id: channelId,
  }).select("_id");
  console.log(databaseChanenlId._id.toString());
//   console.log(databaseChanenlId);
  if (databaseChanenlId._id.toString() !== channelId) {
    throw new ApiError(404, "Channel does not exist");
  }
  const channelSubscribe = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });
//   console.log(channelSubscribe);
  if (channelSubscribe) {
    await channelSubscribe.deleteOne();
    return res
      .status(200)
      .json(
        new ApiResponse(200, null, "unsubscribe to this channel sccussfully")
      );
  } else {
    const channelSubscribe = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(201, channelSubscribe, "channel subscribe scussfully")
      );
  }
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
export { toggleSubscriber, getUserChannelSubscribers,getUserSubscribedChannel };
