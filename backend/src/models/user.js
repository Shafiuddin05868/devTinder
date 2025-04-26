import mongoose from 'mongoose'

export const User = new mongoose.Schema({
    name: string,
    email: string,
    password: string,
    phone: number,
    age: number,
    gender: string
})