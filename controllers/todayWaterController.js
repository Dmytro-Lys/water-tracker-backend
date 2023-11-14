import WaterInput from "../models/WaterInput.js";
import { calculateDailyFulfillment } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

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
  }).select("-createdAt -updatedAt");

  const dailyNormFulfillment = calculateDailyFulfillment(
    waterInputsForToday,
    waterRate
  );

  res.json({ waterInputsForToday, dailyNormFulfillment });
};

export default {
  getForToday: ctrlWrapper(getForToday),
};
