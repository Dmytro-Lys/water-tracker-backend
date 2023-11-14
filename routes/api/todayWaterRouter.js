import express from "express";
import todayController from "../../controllers/todayController.js";

import { authenticate } from "../../middlewares/index.js";

const todayRouter = express.Router();
todayRouter.use(authenticate);

todayRouter.get("/", todayController.getForToday);

export default todayRouter;
