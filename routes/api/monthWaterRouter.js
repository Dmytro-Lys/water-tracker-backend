import express from "express";
import monthWaterController from "../../controllers/monthWaterController.js";

import { authenticate, isValidMonth } from "../../middlewares/index.js";

const monthRouter = express.Router();
monthRouter.use(authenticate);

monthRouter.get("/:monthNumber", isValidMonth, monthWaterController.getByMonth);

export default monthRouter;
