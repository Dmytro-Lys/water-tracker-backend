import express from 'express';
import waterRateController from "../../controllers/waterRateController.js";
import { isEmptyBody, authenticate,  userValidateWaterRate } from '../../middlewares/index.js';

const waterRateRouter = express.Router();

waterRateRouter.patch("/", authenticate, isEmptyBody, userValidateWaterRate, waterRateController.updateWaterRateUser);

export default waterRateRouter;