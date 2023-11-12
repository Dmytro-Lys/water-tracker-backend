import { HttpError } from "../helpers/index.js";

const isValidMonth = (req, res, next) => {
  const { month } = req.params;

  if (month !== undefined) {
    const monthNumber = Number(month);

    if (isNaN(monthNumber)) {
      return next(HttpError(400, "Invalid month. Month must be a number."));
    }

    req.filter = { ...req.filter, month: monthNumber };
  }

  next();
};

export default isValidMonth;
