import WaterInput from "../models/WaterInput.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { _id: owner } = req.user;
  const skip = (page - 1) * limit;
  let query = { owner };
  const result = await WaterInput.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
};
