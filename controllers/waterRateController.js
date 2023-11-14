import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";


const updateWaterRateUser = async (req, res) => {
    const { waterRate } = req.body;
    const { _id, email } = req.user;
     const user = await User.findByIdAndUpdate(_id, { waterRate });
    if (!user) throw HttpError(404, "Not found");
    res.status(200).json({
        email,
        waterRate
    })
}

export default {
    updateWaterRateUser: ctrlWrapper(updateWaterRateUser),
}