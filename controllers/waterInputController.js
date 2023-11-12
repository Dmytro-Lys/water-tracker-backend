import WaterInput from "../models/WaterInput.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  let query = { owner };
  const result = await WaterInput.find(query, "-createdAt -updatedAt");
  res.json(result);
};

const getForToday = async (req, res) => {
  const { _id: owner, waterRate } = req.user;

  const currentDate = new Date();

  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0); // Установка времени на начало текущего дня

  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999); // Установка времени на конец текущего дня

  const waterInputsForToday = await WaterInput.find({
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    owner,
  });

  const sumOfFulfillment = waterInputsForToday.reduce(
    (sum, el) => sum + el.waterVolume,
    0
  );

  const dailyNormFulfillment =
    waterRate !== 0 ? (sumOfFulfillment / waterRate) * 100 : 0;

  res.json({ waterInputsForToday, dailyNormFulfillment });
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
  getForToday: ctrlWrapper(getForToday),
  // getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  delById: ctrlWrapper(delById),
  updateWaterInput: ctrlWrapper(updateWaterInput),
};
