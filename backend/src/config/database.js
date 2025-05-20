import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
export const databaseConnect = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL)
    .finally(console.log("database connection established"))
}

// 6AW2lxOO8CXlkGXP
