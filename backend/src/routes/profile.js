import express from "express";
import {userAuth} from "../middlewares/auth.js"

const profileRouter = express.Router();

//profile
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send("internal server error: " + err.message);
  }
});

export { profileRouter };
