import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

const waterInputSchema = new Schema(
  {
    waterVolume: {
      type: Number,
      min: 1,
      max: 500,
      required: [true, "Enter the value of the water used"],
    },
    date: {
      type: Date,
      default: Date.now,
      required: [true, "Enter the time of entering"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

waterInputSchema.post("save", handleSaveError);
waterInputSchema.pre("findOneAndUpdate", runValidatorsAtUpdate);
waterInputSchema.post("findOneAndUpdate", handleSaveError);

const WaterInput = model("waterInput", waterInputSchema);

// Joi
export const waterInputSchemaJoi = Joi.object({
  waterVolume: Joi.number().min(1).max(500).required().messages({
    "number.min": `The "Input" should be minimum {#limit}`,
    "number.max": `The "Input" should be maximum {#limit}`,
    "any.required": `"waterVolume" required field`,
  }),
  date: Joi.date().required().messages({
    "any.required": `"Set the time of entering"`,
  }),
});

export const updateWaterInputSchema = Joi.object({
  waterVolume: Joi.number().min(1).max(500).required().messages({
    "number.min": `The "Input" should be minimum {#limit}`,
    "number.max": `The "Input" should be maximum {#limit}`,
    "any.required": `"waterVolume" required field`,
  }),
});

export default WaterInput;
