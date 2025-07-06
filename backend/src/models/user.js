import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Must enter the name"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // validate: {
      //   validator: (value) => {
      //     return validator.isEmail(value)
      //   },
      // },
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be at least 8 characters long"],
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
      minLength: [10, "Phone number must be at least 10 characters long"],
      maxLength: [20, "Phone number is invalid"],
    },
    age: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 10
        },
        message: "Age must be at least 18",
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be male, female or other",
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: function (value) {
          return value.length > 0 && value.length < 10
        },
        message: "At least one skill is required and maximum 10",
      },
    },
  },
  {
    timestamps: true,
  }
)
userSchema.methods.comparePassword = function (passwordInsertedByUser){
  return bcrypt.compare(passwordInsertedByUser, this.password)
}
userSchema.methods.createJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  })
}

export const User = mongoose.model("User", userSchema)
