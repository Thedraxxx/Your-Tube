import { Router } from "express";
import userRegister from "../controllers/user.controller.js";
import  upload  from "../middlwares/multer.middleware.js";


const userRouter = Router();

userRouter.route("/register").post(  // middleware befor the user register for file handling
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
              name: "coverImage",
              maxCount: 1
        }
    ]),
    userRegister)


export default userRouter;