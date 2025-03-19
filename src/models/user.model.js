import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
   userName: {
    type: String,
    required: true,
    lowecase: true,
    unique: true,
    trim: true,
    index: true, // searchable optimize....
   },
   email:{
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    match: []
   },
   fullName: {
    type: String,
    required: true,
    trim: true,
    index: true,
   },
   password: {
    type: String, // hasing garara rakhna...
    required: [true, 'password is required'],
    select: false,
   },
   avatar: {
    type: String, //aws type service cloudary url
    required: true,
   },
   coverImage: {
    type: String,
   },
   watchHistory: {
    type: mongoose.Schema.ObjectId,
    ref: "video"
   },
   refreshTolen: {
    type: String,
   }

},{timestamps: true});

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
     this.password= await bcrypt.hash(this.password, 10);
     next();
});

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)

}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)