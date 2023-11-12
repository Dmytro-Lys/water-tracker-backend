import express from "express";
import waterInputController from "../../controllers/waterInputController.js";
import {
  waterInputSchemaJoi,
  updateWaterInputSchema,
} from "../../models/WaterInput.js";
import {
  isEmptyBody,
  authenticate,
  isValidId,
  isValidMonth,
} from "../../middlewares/index.js";
import validateBody from "../../decorators/validateBody.js";

const waterInputRouter = express.Router();
waterInputRouter.use(authenticate);

const waterInputValidate = validateBody(waterInputSchemaJoi);
const updateWaterInputValidate = validateBody(updateWaterInputSchema);

waterInputRouter.get("/", waterInputController.getAll);

waterInputRouter.get("/today", waterInputController.getForToday);

waterInputRouter.get("/:month", isValidMonth, waterInputController.getByMonth);

waterInputRouter.post(
  "/",
  isEmptyBody,
  waterInputValidate,
  waterInputController.add
);

waterInputRouter.patch(
  "/:id/waterVolume",
  isValidId,
  isEmptyBody,
  updateWaterInputValidate,
  waterInputController.updateWaterInput
);

waterInputRouter.delete("/:id", isValidId, waterInputController.delById);

export default waterInputRouter;
