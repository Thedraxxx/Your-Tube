import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    videos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    likedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},{timestamps: true});

const Like = mongoose.model("Like",likeSchema);

export default Like;