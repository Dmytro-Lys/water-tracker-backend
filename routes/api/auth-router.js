import express from 'express';
import authController from "../../controllers/auth-controller.js";
import { isEmptyBody, userValidateSignup, userValidateSignin, authenticate, userValidateEmail } from '../../middlewares/index.js';

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, userValidateSignup, authController.signup)

authRouter.post("/signin", isEmptyBody, userValidateSignin, authController.signin)

authRouter.post("/logout", authenticate, authController.signout);

authRouter.post("/reset-password", userValidateEmail, authController.resetPassword);


export default authRouter;