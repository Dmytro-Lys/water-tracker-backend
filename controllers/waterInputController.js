import WaterInput from "../models/WaterInput.js";
import {
  HttpError,
  calculateDailyFulfillment,
  formatDate,
  regroupedDataByDays,
} from "../helpers/index.js";
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

  const dailyNormFulfillment = calculateDailyFulfillment(
    waterInputsForToday,
    waterRate
  );

  res.json({ waterInputsForToday, dailyNormFulfillment });
};

const getByMonth = async (req, res) => {
  const { _id: owner, waterRate } = req.user;
  const { month } = req.params;
  const adjustedMonth = parseInt(month) - 1; //Уменьшаем на 1, чтобы соответствовать нумерации месяцев в JavaScript

  const startOfMonth = new Date();
  startOfMonth.setMonth(adjustedMonth, 1); // Устанавливает первое число месяца

  const endOfMonth = new Date();
  endOfMonth.setMonth(adjustedMonth + 1, 0); // Устанавливает последний день месяца

  const waterInputsForThisMonth = await WaterInput.find({
    date: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
    owner,
  });
  if (!waterInputsForThisMonth.length) {
    throw HttpError(404, `No data available for month ${month}`);
  }

  const filteredArray = Object.values(
    regroupedDataByDays(waterInputsForThisMonth)
  );

  const result = filteredArray.map((array) => {
    const formattedDate = formatDate(array[0].date);

    const formattedWaterRate = (waterRate / 1000).toFixed(1) + " L";

    const dailyNormFulfillment = calculateDailyFulfillment(array, waterRate);

    return {
      data: formattedDate,
      waterRate: formattedWaterRate,
      dailyNormFulfillment,
      servingOfWater: array.length,
    };
  });

  res.json(result);
};

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
  getByMonth: ctrlWrapper(getByMonth),
  add: ctrlWrapper(add),
  delById: ctrlWrapper(delById),
  updateWaterInput: ctrlWrapper(updateWaterInput),
};
