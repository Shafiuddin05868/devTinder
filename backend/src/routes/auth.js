import express from 'express';
import { User } from '../models/user.js';
import { validate } from '../utils/validate.js';
import bcrypt from 'bcrypt';
import ms from 'ms';
const authRouter = express.Router();

//user sign up
authRouter.post("/signUp", async (req, res) => {
  const user = new User(req.body)
  validate(req)

  //if the user already exists
  const existingUser = await User.findOne({email: user.email})
  if (existingUser) {
    return res.status(400).json({message: "user already exists"})
  }

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
authRouter.post("/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send("email and password are required")
    }
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).send("invalid credential")
    }
    const result = await user.comparePassword(req.body.password)
      if (result) {
        //create jwt token
        const token = user.createJwtToken()
        // add the token to the cookie and send it to the client
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: ms(process.env.JWT_EXPIRATION), // convert to milliseconds
        })

        res.status(200).send("user logged in successfully")
      } else {
        res.status(404).send("invalid credential")
      }

  } catch (err) {
    res.status(500).send("internal server error: " + err.message)
  }
})

//user logout
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })
  res.status(200).send("user logged out successfully")
})

//forget password without verification take email and password directly
authRouter.patch("/forgetPassword", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send("email and password are required")
    }
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(404).send("invalid credential")
    }
    bcrypt.hash(req.body.password, 10, async (err, hash)=> {
      if (err) {
        return res.status(500).send("Internal server error")
      }
      user.password = hash

      try {
        await user.save()
        res.status(200).json({message: "password updated successfully"})
      } catch (err) {
        res.status(400).send(err.message)
      }
    })
  } catch (err) {
    res.status(500).send("internal server error: " + err.message)
  }
})


export { authRouter };
