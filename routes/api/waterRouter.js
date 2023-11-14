import express from "express";
import waterController from "../../controllers/waterController.js";
import {
  waterInputSchemaJoi,
  updateWaterInputSchema,
} from "../../models/WaterInput.js";
import {
  isEmptyBody,
  authenticate,
  isValidId,
} from "../../middlewares/index.js";
import validateBody from "../../decorators/validateBody.js";

const waterRouter = express.Router();
waterRouter.use(authenticate);
const waterInputValidate = validateBody(waterInputSchemaJoi);
const updateWaterInputValidate = validateBody(updateWaterInputSchema);

waterRouter.post("/", isEmptyBody, waterInputValidate, waterController.add);

waterRouter.patch(
  "/:id/waterVolume",
  isValidId,
  isEmptyBody,
  updateWaterInputValidate,
  waterController.updateWaterInput
);

waterRouter.delete("/:id", isValidId, waterController.delById);

export default waterRouter;
