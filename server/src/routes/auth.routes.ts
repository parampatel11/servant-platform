import { Router } from "express";
import { signup, login , logout, refreshToken, getSession, updateProfilePicture } from "../controllers/auth.controller";
import AuthMiddleware from "../middlewares/auth.middleware";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const authRouter = Router()

authRouter.post("/signup",uploadMiddleware.single("image"),signup)
authRouter.post("/login",login)
authRouter.post("/logout",logout)
authRouter.get("/session",getSession)
authRouter.get("/refresh",AuthMiddleware,refreshToken)
authRouter.put("/profile-picture",uploadMiddleware.single("image"),updateProfilePicture)

export default authRouter