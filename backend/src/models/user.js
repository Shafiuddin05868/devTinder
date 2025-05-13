import mongoose from "mongoose"

export const userSchema = new mongoose.Schema({
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
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      },
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be at least 8 characters long"],
  },
  phone: {
    type: Number,
    validate: {
      validator: function (value) {
        return /^\d{10}$/.test(value)
      },
      message: "Invalid phone number",
    },
  },
  age: {
    type: Number,
    validate: {
      validator: function (value) {
        return value >= 18
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
        return value.length > 0
      },
      message: "At least one skill is required",
    },
  }
}, {
    timestamps: true,
})

export const User = mongoose.model("User", userSchema)
