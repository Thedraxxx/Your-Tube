import mongoose from "mongoose";

const plylistSchema = new mongoose.Schema({
       name: {
        type: String,
        required: true,
       },
       discription: {
        type: String,
        required: true,
       },
       owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
       },
       video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
       }
},{timestamps: true})

const Playlist = mongoose.model("Playlist",plylistSchema)

export default Playlist;