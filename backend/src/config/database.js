import mongoose from "mongoose";
export const databaseConnect = async() => {
  await mongoose.connect(
    "mongodb+srv://shafiuddin05868:6AW2lxOO8CXlkGXP@z.h4ko4sa.mongodb.net/devTinder"
  ).finally(console.log('database connection established'))
};

// 6AW2lxOO8CXlkGXP
