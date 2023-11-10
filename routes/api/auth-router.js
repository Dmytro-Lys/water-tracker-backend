import express from 'express';
import authController from "../../controllers/auth-controller.js";
import { isEmptyBody, userValidateSignup, userValidateSignin, authenticate,  upload, userValidateWaterRate, userValidateAll } from '../../middlewares/index.js';

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, userValidateSignup, authController.signup)

authRouter.post("/login", isEmptyBody, userValidateSignin, authController.signin)

authRouter.post("/logout", authenticate, authController.signout);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.patch("/", authenticate, isEmptyBody, userValidateAll, authController.updateUserInfo);

authRouter.patch("/water-rate", authenticate, isEmptyBody, userValidateWaterRate, authController.updateWaterRateUser);

authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatarUser);




export default authRouter;