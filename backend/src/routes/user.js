import express from "express";
import { connectionRequest } from "../models/connectionRequest.js";
import { userAuth } from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user  = req.user;
    const requests = await connectionRequest.find({
        receiverId: user.id,
        status: "interested"
    }).populate("senderId", "name photoUrl age")

    res.status(200).json({ message: requests.length > 0 ? "Requests fetched successfully" : "No request found", data: requests || [] })
  } catch (error) {
    res
      .status(400)
      .json({ message: "ERROR: " + error.message || "Unknown error" });
  }
});

export { userRouter };
