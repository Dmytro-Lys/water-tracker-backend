import express from "express";
import todayWaterController from "../../controllers/todayWaterController.js";

import { authenticate } from "../../middlewares/index.js";

const todayRouter = express.Router();
todayRouter.use(authenticate);

todayRouter.get("/", todayWaterController.getForToday);

export default todayRouter;
