import WaterInput from "../models/WaterInput.js";
import {
  calculateDailyFulfillment,
  formatDate,
  regroupedDataByDays,
} from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getByMonth = async (req, res) => {
  const { _id: owner, waterRate } = req.user;
  const { monthNumber } = req.params;
  const adjustedMonth = parseInt(monthNumber) - 1; //Уменьшаем на 1, чтобы соответствовать нумерации месяцев в JavaScript

  const startOfMonth = new Date();
  startOfMonth.setMonth(adjustedMonth, 1); // Устанавливает первое число месяца
  startOfMonth.setHours(0, 0, 0, 0); // Установка времени на начало дня

  const endOfMonth = new Date();
  endOfMonth.setMonth(adjustedMonth + 1, 0); // Устанавливает последний день месяца
  endOfMonth.setHours(23, 59, 59, 999); // Установка времени на конец дня

  const waterInputsForThisMonth = await WaterInput.find({
    date: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
    owner,
  });

  const filteredArray = Object.values(
    regroupedDataByDays(waterInputsForThisMonth)
  );

  const result = filteredArray.map((array) => {
    const formattedDate = formatDate(array[0].date);

    const formattedWaterRate = waterRate / 1000;

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

export default {
  getByMonth: ctrlWrapper(getByMonth),
};
