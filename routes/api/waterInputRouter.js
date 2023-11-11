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
} from "../../middlewares/index.js";
import validateBody from "../../decorators/validateBody.js";

const waterInputRouter = express.Router();
waterInputRouter.use(authenticate);
const waterInputValidate = validateBody(waterInputSchemaJoi);
const updateWaterInputValidate = validateBody(updateWaterInputSchema);

waterInputRouter.get("/", waterInputController.getAll);

// waterInputRouter.get("/:id", isValidId, waterInputController.getById);

waterInputRouter.post(
  "/",
  isEmptyBody,
  waterInputValidate,
  waterInputController.add
);

waterInputRouter.patch(
  "/:id/waterInput",
  isValidId,
  isEmptyBody,
  updateWaterInputValidate,
  waterInputController.updateWaterInput
);

waterInputRouter.delete("/:id", isValidId, waterInputController.delById);

export default waterInputRouter;
