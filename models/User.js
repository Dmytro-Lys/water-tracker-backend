import { Schema, model, trusted } from "mongoose";
import Joi from "joi";

import { handleSaveError, runValidatorsAtUpdate } from "./hooks.js";

import { addFieldMongoose, addFieldJoi } from "./validation-tools.js";

const regExpPassword =  /^\S+$/
//const regExpPassword = /(?=.*[0-9])(?=.*[!@#$%^&*()\-\_=+,<.>/?;:'\[\]{}|])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*()\-\_=+,<.>/?;:'\[\]{}|]+/,
//const errorMessagePassword = "The password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character",
const userShemaValidation = {
   password: {
      regExp: regExpPassword,
      errorMessage: "The password contains invalid characters",
      requiredErrorMessage: 'Set password for user'
   },
    oldPassword: {
      regExp: regExpPassword,
      errorMessage: "The old password contains invalid characters"
   },
   newPassword: {
      regExp: regExpPassword,
      errorMessage: "The new password contains invalid characters"
   },
   email: {
      regExp: /^([0-9A-Za-z]{1}([-_\.]?[0-9A-Za-z]+)*)@(([0-9A-Za-z]{1}([-_]?[0-9A-Za-z]+)*\.){1,2}[A-Za-z]{2,})$/,
      errorMessage: "Field email must be a valid email",
      requiredErrorMessage: 'Email is required'
   },
   userName: {
       regExp: /^[a-zA-Zа-яіїєА-ЯІЇЄ]+((['\-][a-zA-Zа-яіїєА-ЯІЇЄ])?[a-zA-Zа-яіїєА-ЯІЇЄ]*)*$/,
      errorMessage: "Field name contains invalid characters",
      requiredErrorMessage: ''
   }
}

const genderList = ["female", "male"]
// Mongoose
const userSchemaDB = new Schema({
   password: { ...addFieldMongoose(userShemaValidation.password), minlength: 8, maxlength: 64 },
   email: { ...addFieldMongoose(userShemaValidation.email), unique: true },
   userName: { ...addFieldMongoose(userShemaValidation.userName), required: false, maxlength: 32 },
   waterRate: {
      type: Number,
      min: 1,
      max: 15000,
      default: 2000
   },
   gender: {
    type: String,
    enum: genderList,
    default: "female"
  },
   avatarURL: String,
   lockedTokens: [{
      token: String,
      dateLock: Date
   }],
   logined: Boolean
   
}, { versionKey: false, timestamps: true })
   
userSchemaDB.methods.checkToken = function (token) {
   return this.lockedTokens && this.lockedTokens.length > 0 ?  this.lockedTokens.find( item => item.token === token) : null
}

userSchemaDB.methods.clearLockedTokens = function () {
   const now = new Date()
   return this.lockedTokens && this.lockedTokens.length > 0 ? this.lockedTokens.filter( item =>  now - item.dateLock < 86400000) : []
}

userSchemaDB.post("save", handleSaveError);

userSchemaDB.pre("findOneAndUpdate", runValidatorsAtUpdate);

userSchemaDB.post("findOneAndUpdate", handleSaveError);

const User = model("user", userSchemaDB);


// Joi
export const userSchemaAuth = Joi.object({
   password: addFieldJoi.call(Joi, userShemaValidation.password)
         .min(8).max(64),
    email: addFieldJoi.call(Joi, userShemaValidation.email)
}) 

export const userSchemaEmail = Joi.object({
    email: addFieldJoi.call(Joi, userShemaValidation.email, "missing required field email")
})

export const userSchemaWaterRate = Joi.object({
    waterRate: Joi.number().min(1).max(15000).required()
})

export const userSchemaAll = Joi.object({
   email: addFieldJoi.call(Joi, userShemaValidation.email, "",  false ),
   oldPassword: addFieldJoi.call(Joi, userShemaValidation.oldPassword, "",  false )
         .min(8).max(64),
   newPassword: addFieldJoi.call(Joi, userShemaValidation.newPassword, "",  false )
         .min(8).max(64),
    userName: addFieldJoi.call(Joi, userShemaValidation.userName, "", false ).max(32),
    gender: Joi.string().valid(...genderList)
})

export default User;