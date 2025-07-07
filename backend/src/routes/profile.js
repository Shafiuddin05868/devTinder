import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { validateProfileUpdate } from "../utils/validate.js";

const profileRouter = express.Router();

//profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (err) {
    res.status(500).send("internal server error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = validateProfileUpdate(req);
    !isEditAllowed && res.status(400).send("invalid update");
    const userInfo = req.user;
    Object.keys(req.body).forEach((key) => (userInfo[key] = req.body[key]));
    await userInfo.save();
    res.status(200).send({message:"Profile updated successfully",data: userInfo});
  } catch (err) {
    res.status(500).send("internal server error: " + err.message);
  }
});

export { profileRouter };
