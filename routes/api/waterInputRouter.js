import express from "express";
import waterInputController from "../../controllers/waterInputController.js";

import { authenticate } from "../../middlewares/index.js";

const waterInputRouter = express.Router();
waterInputRouter.use(authenticate);

waterInputRouter.get("/", waterInputController.getAll);

export default waterInputRouter;
