import express from "express";
import { userAuth } from "../middlewares/auth.js";
import bcrypt from "bcrypt";
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
    res
      .status(200)
      .send({ message: "Profile updated successfully", data: userInfo });
  } catch (err) {
    res.status(500).send("internal server error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const isMatch = bcrypt.compareSync(req.body.oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "password is incorrect" });
    }
    bcrypt.hash(req.body.newPassword, 10, async (err, hash) => {
      if (err) {
        throw new Error("Internal server error: " + err.message);
      }
      user.password = hash;
      await user.save();
      res
        .status(200)
        .send({ message: "Password updated successfully", data: user });
    });
  } catch (err) {
    res.status(500).send("internal server error: " + err.message);
  }
});

export { profileRouter };
