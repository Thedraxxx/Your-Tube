import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
        subscriber: {  //the login user who subscribe to the channel....
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        channel: {  //the user who the login user subscribe to
             type: mongoose.Schema.Types.ObjectId,
             ref: "User"
        }
},{timestamps: true});

const Subscription = mongoose.model("Subscirption",subscriptionSchema);

export default Subscription;