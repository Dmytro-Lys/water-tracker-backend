import express from 'express';
import userController from "../../controllers/userController.js";
import { isEmptyBody, authenticate,  upload,  userValidateAll } from '../../middlewares/index.js';

const userRouter = express.Router();

userRouter.get("/current", authenticate, userController.getCurrent);

userRouter.patch("/", authenticate, isEmptyBody, userValidateAll, userController.updateUserInfo);

userRouter.patch("/avatars", authenticate, upload.single("avatar"), userController.updateAvatarUser);


export default userRouter;