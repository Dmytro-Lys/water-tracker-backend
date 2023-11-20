import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import generatePassword from "omgopass"


import User from "../models/User.js";
import { HttpError, sendEmail} from "../helpers/index.js";
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
    const {_id, lockedToken} = req.user;
    await User.findByIdAndUpdate(_id, {lockedToken});
    res.status(204).json()
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
    await User.findByIdAndUpdate(user._id, { password});

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
    signout: ctrlWrapper(signout)
}