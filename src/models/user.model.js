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
//Hash the user password befor storing them...
//yo aauta middle ware ho jasla password lai store garxa database ma....
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password);
    
});
//check if the password is correct during login ...
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
};

UserSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.userName,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};
UserSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
}

