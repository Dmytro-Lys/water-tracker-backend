import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import Jimp from "jimp";
import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

import User from "../models/User.js";
import { HttpError, sendEmail, cloudinary } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const signup = async(req, res, next) => {
    const {password, email} = req.body
    req.body.password = await bcrypt.hash(password, 10);
    
    const user = await User.create(req.body);
    
    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
   
    res.status(201).json({
         token,
        user: {
      email
     }
    })
}

const signin = async(req, res, next) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
       throw HttpError(401,"Email or password is wrong")
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
       throw HttpError(401,"Email or password is wrong")
    }
    
   
    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    
    res.status(200).json({
        token,
        user: {
            email
        }
    })
}

const signout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});
    res.status(204).json()
}

const getCurrent = async(req, res)=> {
    const { email, avatarURL, gender, waterRate, userName} = req.user;
    res.status(200).json({
        email,
        avatarURL,  
        userName,
        gender,
        waterRate
    })
}

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

const updateUserInfo = async (req, res) => {
     const { password } = req.body
    if (password) req.body.password = await bcrypt.hash(password, 10);
    
    const { _id, email } = req.user;
     const user = await User.findByIdAndUpdate(_id, req.body);
    if (!user) throw HttpError(404, "Not found");
    const { userName, gender } = user;
    res.status(200).json({
        email,
        userName,
        gender
    })
}

const updateAvatarUser = async (req, res) => {
    const { _id } = req.user;
    const { path } = req.file;
     const {url:avatarURL} = await cloudinary.uploader.upload(path, {
        folder: "water-tracker"
    });
    await fs.unlink(path);
    const user = await User.findByIdAndUpdate(_id, { avatarURL });
    if (!user) throw HttpError(404, "Not found");
    res.status(200).json({
        avatarURL
    })
}

export default {
    signup: ctrlWrapper(signup),
    // verify: ctrlWrapper(verify),
    // resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    signin: ctrlWrapper(signin),
    signout: ctrlWrapper(signout),
    getCurrent: ctrlWrapper(getCurrent),
    updateWaterRateUser: ctrlWrapper(updateWaterRateUser),
    updateAvatarUser: ctrlWrapper(updateAvatarUser),
    updateUserInfo: ctrlWrapper(updateUserInfo),
}