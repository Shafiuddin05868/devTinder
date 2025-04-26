import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: Number,
    age: Number,
    gender: String
})

export const User = mongoose.model('User', userSchema)