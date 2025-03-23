import { asyncHandler } from "../utils/asyncHandeler.js";
const userRegister = asyncHandler(async(req,res)=>{
    const {name, email,password} = req.body;

    const newUser = { id: Date.now(),name,email};

    res.status(200).json({
        success: true,
        message: "user registered sucessfully",
        user: newUser,
    })
})

export default userRegister;