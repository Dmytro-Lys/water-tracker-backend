import WaterInput from "../models/WaterInput.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const newInput = await WaterInput.create({ ...req.body, owner });
  const result = {
    _id: newInput._id,
    waterVolume: newInput.waterVolume,
    date: newInput.date,
    owner: newInput.owner,
  };
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
    req.body,
    { new: true, projection: { createdAt: 0, updatedAt: 0 } }
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
