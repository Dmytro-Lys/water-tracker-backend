import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import generatePassword from "omgopass"


import User from "../models/User.js";
import { HttpError, sendEmail, cloudinary } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET} = process.env;

const signup = async(req, res, next) => {
    const {password, email} = req.body
    req.body.password = await bcrypt.hash(password, 10);
    
    const {_id, userName = '', avatarURL = '', gender, waterRate} = await User.create(req.body);
    
    const payload = {
        id: _id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(_id, { token });
   
    res.status(201).json({
         token,
        user: {
            email,
            userName,
            avatarURL,
            gender,
            waterRate
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
    
    const {_id, userName = '', avatarURL = '', gender, waterRate} = user
    const payload = {
        id: _id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(_id, { token });
    
    res.status(200).json({
        token,
        user: {
            email,
            userName,
            avatarURL,
            gender,
            waterRate
        }
    })
}

const signout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""});
    res.status(204).json()
}

const getCurrent = async(req, res)=> {
    const { email, avatarURL = '', gender, waterRate, userName = ''} = req.user;
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
    if (!req.file) {
       throw HttpError(400,"File not found")
    }
    const { path } = req.file;
     const {url:avatarURL} = await cloudinary.uploader.upload(path, {
         folder: "water-tracker/avatars",
         public_id: `${_id}_avatar`,
         overwrite: true,
         transformation: { width: 250, height: 250, gravity: "faces", crop: "fill" } 
      
    });
    await fs.unlink(path);
    const user = await User.findByIdAndUpdate(_id, { avatarURL });
    if (!user) throw HttpError(404, "Not found");
    res.status(200).json({
        avatarURL
    })
}

const resetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "Email not found")
    }
    
    const newPassword = generatePassword({
        syllablesCount: 3,
        minSyllableLength: 2,
        maxSyllableLength: 5,
        separators: "-_+=@:?<>{}()#$%^&*!"
    })

    const password = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password, token: "" });

    const sendNewPassword = {
        to: email,
        subject: "Reset password",
        html: `<div style="font-size: 14px"><h3>Reset password!</h3>
        <p>You received this email because you sent a password reset request. <br>
         A new password has been generated for you. <br>
         Your new password: <strong>${newPassword}</strong> <br>
         You can now use your new password to sign in to the Water Tracker App</p>
        </div>`
    }

    await sendEmail(sendNewPassword);

    res.status(200).json({
        message: "A new password has been sent to your email"
    })
}

export default {
    signup: ctrlWrapper(signup),
    resetPassword: ctrlWrapper(resetPassword),
    signin: ctrlWrapper(signin),
    signout: ctrlWrapper(signout),
    getCurrent: ctrlWrapper(getCurrent),
    updateWaterRateUser: ctrlWrapper(updateWaterRateUser),
    updateAvatarUser: ctrlWrapper(updateAvatarUser),
    updateUserInfo: ctrlWrapper(updateUserInfo),
}