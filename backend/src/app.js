import express from "express"
import { databaseConnect } from "./config/database.js"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config()

//routes import
import { authRouter } from "./routes/auth.js"
import { profileRouter } from "./routes/profile.js"
import { requestRouter } from "./routes/request.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)

//connect database and start server
;(async () => {
  try {
    await databaseConnect()
    app.listen(3000, () => {
      console.log("The server is running on port 3000")
    })
  } catch (err) {
    console.error(err, "cannot connect to the database")
  }
})()
