import express from "express"
import { databaseConnect } from "./config/database.js"
import { User, userSchema } from "./models/user.js"
import { validate } from "./utils/validate.js"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import ms from "ms"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import { userAuth } from "./middlewares/auth.js"

const app = express()

app.use(express.json())
app.use(cookieParser())

//user sign up
app.post("/signUp", async (req, res) => {
  const user = new User(req.body)
  validate(req)

  bcrypt.hash(user.password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).send("Internal server error")
    }

    user.password = hash

    try {
      await user.save()
      res.send("user create successfully")
    } catch (err) {
      res.status(400).send(err.message)
    }
  })
})

//user login
app.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send("email and password are required")
    }
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).send("invalid credential")
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(500).send("internal server error")
      }
      if (result) {
        //create jwt token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRATION,
        })
        // add the token to the cookie and send it to the client
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: ms(process.env.JWT_EXPIRATION), // convert to milliseconds
        })

        res.status(200).send("user logged in successfully")
      } else {
        res.status(404).send("invalid credential")
      }
    })
  } catch (err) {
    res.send("internal server error: " + err.message)
  }
})

//profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user)
  } catch (err) {
    res.status(500).send("internal server error: " + err.message)
  }
})

//get all users
app.get("/users", async (req, res) => {
  try {
    const filter = {}

    //filters query parameters keys from the schema
    const keys = Object.keys(userSchema.obj).filter((key) => key !== "password")
    const queries = Object.keys(req.query) //get all query parameters
    queries.forEach((query) => {
      //if the query parameters are in the schema keys then add it to the filter object
      if (keys.includes(query)) {
        filter[query] = req.query[query]
      }
    })
    //if there are any queries then add filter if not then send all users
    if (Object.keys(filter).length > 0) {
      const users = await User.find(filter).select("-password")
      users.length > 0 ? res.send(users) : res.status(404).send("No user found")
    } else {
      //no filter get all users
      const users = await User.find().select("-password")
      res.send(users)
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

//get single user
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    user ? res.send(user) : res.status(404).send("No user found")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("server error or invalid id")
  }
})

// delete user
app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    user
      ? res.send("user deleted successfully")
      : res.status(404).send("No user found")
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error or invalid id")
  }
})

//update user
app.patch("/user/:id", async (req, res) => {
  try {
    validate(req)

    //impliment api validation
    const keys = Object.keys(userSchema.obj).filter((key) => key !== "password")

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    user ? res.send(user) : res.status(404).send("No user found")
  } catch (err) {
    res.status(500).send(err.message)
  }
})

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
