import express from 'express';
import authController from "../../controllers/auth-controller.js";
import { isEmptyBody, userValidateAuth,  authenticate, userValidateEmail } from '../../middlewares/index.js';

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, userValidateAuth, authController.signup)

authRouter.post("/signin", isEmptyBody, userValidateAuth, authController.signin)

authRouter.post("/logout", authenticate, authController.signout);

authRouter.post("/reset-password", userValidateEmail, authController.resetPassword);


export default authRouter;