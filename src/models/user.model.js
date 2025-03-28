import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ----------------------------------------------
   🛠️ USER SCHEMA - Defines User Data Structure
   ---------------------------------------------- */
const userSchema = new mongoose.Schema(
  {
    /* 🏷️ Unique Username (lowercase & trimmed) */
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },

    /* 📧 Email (must be unique & follow format) */
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },

    /* 🆔 Full Name (indexed for faster searches) */
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    /* 🔒 Password (hashed before saving) */
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, // Hides password in queries
    },

    /* 🖼️ Avatar Image (stored in cloud services) */
    avatar: {
      type: String, // Cloudinary / AWS URL
      required: true,
    },

    /* 🌆 Cover Image (optional) */
    coverImage: {
      type: String,
    },

    /* 📽️ Watch History (References Video Model) */
    watchHistory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },

    /* 🔄 Refresh Token (for authentication) */
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true } // ⏳ Automatically adds `createdAt` & `updatedAt`
);

/* ----------------------------------------------------
   🔄 MIDDLEWARE: HASH PASSWORD BEFORE SAVING TO DB
   ---------------------------------------------------- */
userSchema.pre("save", async function (next) {
  // 🛑 If password is not modified, skip hashing
  if (!this.isModified("password")) return next();

  // 🧂 Generate a salt (random string for security)
  const salt = await bcrypt.genSalt(10);

  // 🔐 Hash the password with salt
  this.password = await bcrypt.hash(this.password, salt);

  next(); // ✅ Move to the next middleware
});

/* ------------------------------------------
   ✅ PASSWORD VALIDATION METHOD
   ------------------------------------------ */
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // 🔍 Compare entered password with hashed password
};

/* ------------------------------------------
   🔑 GENERATE ACCESS TOKEN (SHORT-TERM)
   ------------------------------------------ */
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // ⏳ Expiry time from environment variables
  );
};

/* ------------------------------------------
   🔄 GENERATE REFRESH TOKEN (LONG-TERM)
   ------------------------------------------ */
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

/* --------------------------------------------------
   🎯 EXPORT THE USER MODEL FOR USE IN THE APP
   -------------------------------------------------- */
const User = mongoose.model("User", userSchema);
export default User;
  


// 🔄 Flow of Execution (Step-by-Step)
// 1️⃣ User provides details (username, email, password, avatar, etc.).
// 2️⃣ Before saving, the password is hashed if modified.
// 3️⃣ User authentication happens via the isPasswordCorrect method.
// 4️⃣ If login is successful, Access & Refresh tokens are generated.
// 5️⃣ The User model is used in authentication, authorization, and data storage