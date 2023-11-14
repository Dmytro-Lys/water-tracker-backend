import WaterInput from "../models/WaterInput.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await WaterInput.create({ ...req.body, owner });
  res.status(201).json(result);
};

const delById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await WaterInput.findOneAndDelete({ _id: id, owner });
  if (!result) {
    throw HttpError(404, `Card with ${id} is not found`);
  }
  res.json({ message: "Delete success" });
};

const updateWaterInput = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await WaterInput.findOneAndUpdate(
    { _id: id, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `Card with ${id} is not found`);
  }
  res.json(result);
};

export default {
  add: ctrlWrapper(add),
  delById: ctrlWrapper(delById),
  updateWaterInput: ctrlWrapper(updateWaterInput),
};
