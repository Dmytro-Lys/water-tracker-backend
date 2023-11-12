const calculateDailyFulfillment = (data, waterRate) => {
  const sumOfFulfillment = data.reduce((sum, el) => sum + el.waterVolume, 0);

  const dailyNormFulfillment =
    waterRate !== 0 ? (sumOfFulfillment / waterRate) * 100 : 0;

  return dailyNormFulfillment;
};

export default calculateDailyFulfillment;
