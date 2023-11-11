import WaterInput from "../models/WaterInput.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  let query = { owner };
  const result = await WaterInput.find(query, "-createdAt -updatedAt");
  res.json(result);
};

// const getById = async (req, res) => {
//   const { _id: owner } = req.user;

//   const { id } = req.params;
//   const result = await WaterInput.findOne({ _id: id, owner });
//   if (!result) {
//     throw HttpError(404, `Contact with ${contactId} is not found`);
//   }
//   res.json(result);
// };

const add = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(req.user);
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
  getAll: ctrlWrapper(getAll),
  // getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  delById: ctrlWrapper(delById),
  updateWaterInput: ctrlWrapper(updateWaterInput),
};
